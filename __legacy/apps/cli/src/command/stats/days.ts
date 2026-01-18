import {
  eachDayOfIntervalWithTimeZone,
  mapPointListToLineList,
  startOfDayWithTimeZone,
} from '@stayradiated/pomo-core'
import {
  getLabelByName,
  getStreamByName,
  getUserTimeZone,
  retrievePointList,
} from '@stayradiated/pomo-doc'
import type { Doc } from '@stayradiated/pomo-doc'
import * as chrono from 'chrono-node'
import { CliCommand } from 'cilly'
import * as dateFns from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import z from 'zod'
import { getDoc } from '#src/lib/doc.js'

type HandlerOptions = {
  doc: Doc
  timeZone: string
  where: {
    streamId: string
    labelId: string
  }
  startDate: number
  endDate: number
}

const handler = (options: HandlerOptions): undefined | Error => {
  const { doc, timeZone, where, startDate, endDate } = options

  const pointList = retrievePointList({
    doc,
    startDate,
    endDate,
    where: {
      streamIdList: [where.streamId],
    },
  })

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  const daySet = new Set<string>()

  for (const line of lineList) {
    if (!line.labelIdList.includes(where.labelId)) {
      continue
    }

    if (line.stoppedAt) {
      for (const date of eachDayOfIntervalWithTimeZone({
        timeZone,
        startDate: line.startedAt,
        endDate: line.stoppedAt,
      })) {
        const formattedDate = dateFns.format(date, 'yyyy-MM-dd')
        daySet.add(formattedDate)
      }
    } else {
      const formattedDate = dateFns.format(
        toZonedTime(line.startedAt, timeZone),
        'yyyy-MM-dd',
      )
      daySet.add(formattedDate)
    }
  }

  const dayList = Array.from(daySet).sort()
  for (const day of dayList) {
    console.log(day)
  }
}

const $Options = z.object({
  stream: z.string(),
  label: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
})

const daysCmd = new CliCommand('days')
  .withDescription('How many days?')
  .withOptions(
    {
      name: ['-s', '--stream'],
      description: 'Which stream to export',
      required: true,
      args: [
        {
          name: 'name',
          description: 'Name of the stream',
          required: true,
        },
      ],
    },
    {
      name: ['-v', '--label'],
      description: 'Which label to count',
      args: [
        { name: 'label', description: 'Label to filter by', required: true },
      ],
    },
    {
      name: ['-f', '--start-date'],
      description: 'Start date (YYYY.MM.DD)',
      required: true,
      args: [{ name: 'date', description: 'Start date', required: true }],
    },
    {
      name: ['-t', '--end-date'],
      description: 'End date (YYYY.MM.DD)',
      required: false,
      args: [{ name: 'date', description: 'End date', required: true }],
    },
  )
  .withHandler(async (_args, rawOptions) => {
    const options = $Options.parse(rawOptions)

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const timeZone = getUserTimeZone({ doc })

    const startDateInstant = chrono
      .parseDate(options.startDate, {
        instant: new Date(),
        timezone: timeZone,
      })
      ?.getTime()

    if (typeof startDateInstant !== 'number') {
      throw new Error(`Could not parse start date: ${options.startDate}`)
    }

    const endDateInstant = options.endDate
      ? chrono
          .parseDate(options.endDate, {
            instant: new Date(),
            timezone: timeZone,
          })
          ?.getTime()
      : new Date().getTime()

    if (typeof endDateInstant !== 'number') {
      throw new Error(`Could not parse end date: ${options.endDate}`)
    }

    const startDate = startOfDayWithTimeZone({
      instant: startDateInstant,
      timeZone,
    }).getTime()

    const endDate = startOfDayWithTimeZone({
      instant: endDateInstant,
      timeZone,
    }).getTime()

    const stream = getStreamByName({ doc, name: options.stream })
    if (stream instanceof Error) {
      throw stream
    }

    const label = getLabelByName({
      doc,
      name: options.label,
      streamId: stream.id,
    })
    if (label instanceof Error) {
      throw label
    }

    const result = handler({
      doc,
      timeZone,
      where: {
        streamId: stream.id,
        labelId: label.id,
      },
      startDate,
      endDate,
    })
    if (result instanceof Error) {
      throw result
    }
  })

export { daysCmd }
