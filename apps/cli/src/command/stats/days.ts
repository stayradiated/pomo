import * as dateFns from 'date-fns'
import { CliCommand } from 'cilly'
import z from 'zod'
import {
  getUserTimeZone,
  getStreamByName,
  getLabelByName,
  retrievePointList,
} from '@stayradiated/pomo-doc'
import { utcToZonedTime } from 'date-fns-tz'
import type { Doc } from '@stayradiated/pomo-doc'
import { getDoc } from '#src/lib/doc.js'

type HandlerOptions = {
  doc: Doc
  timeZone: string
  where: {
    streamId: string
    labelId: string
  }
}

const handler = (options: HandlerOptions): void | Error => {
  const { doc, timeZone, where } = options

  const pointList = retrievePointList({
    doc,
    startDate: dateFns.parseISO('2023-01-01').getTime(),
    endDate: dateFns.parseISO('2025-01-01').getTime(),
    where: {
      streamIdList: [where.streamId],
    },
  })

  const daySet = new Set<string>()

  for (const point of pointList) {
    if (!point.labelIdList.includes(where.labelId)) {
      continue
    }

    const startedAt = utcToZonedTime(point.startedAt, timeZone)
    const formattedDate = dateFns.format(startedAt, 'yyyy-MM-dd')
    daySet.add(formattedDate)
  }

  const dayList = Array.from(daySet).sort()
  for (const day of dayList) {
    console.log(day)
  }
}

const $Options = z.object({
  stream: z.string(),
  label: z.string(),
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
  )
  .withHandler(async (_args, rawOptions) => {
    const options = $Options.parse(rawOptions)

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const timeZone = getUserTimeZone({ doc })

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
    })
    if (result instanceof Error) {
      throw result
    }
  })

export { daysCmd }
