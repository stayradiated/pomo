import {
  clampLineList,
  durationLocale,
  mapPointListToLineList,
  startOfDayWithTimeZone,
} from '@stayradiated/pomo-core'
import {
  getLabelById,
  getLabelByName,
  getStreamById,
  getStreamByName,
  getUserTimeZone,
  retrievePointList,
} from '@stayradiated/pomo-doc'
import type { Doc } from '@stayradiated/pomo-doc'
import * as chrono from 'chrono-node'
import { CliCommand } from 'cilly'
import * as dateFns from 'date-fns'
import { getDoc } from '#src/lib/doc.js'

type HandlerOptions = {
  doc: Doc
  where: {
    streamId: string | undefined
    labelId: string | undefined
  }
  startDate: number
  endDate: number
}

const handler = (options: HandlerOptions): undefined | Error => {
  const { doc, where, startDate, endDate } = options

  const pointList = retrievePointList({
    doc,
    startDate,
    endDate,
    where: {
      streamIdList: where.streamId ? [where.streamId] : undefined,
    },
  })

  const extendedLineList = mapPointListToLineList(pointList)
  if (extendedLineList instanceof Error) {
    return extendedLineList
  }

  const lineList = clampLineList({
    lineList: extendedLineList,
    currentTime: Date.now(),
    startDate,
    endDate,
  })

  const filterLabelId = where.labelId
  const filteredLineList =
    typeof filterLabelId === 'string'
      ? lineList.filter((line) => line.labelIdList.includes(filterLabelId))
      : lineList

  // StreamId → labelId → durationMs
  const streamDurationMap = new Map<string, Map<string, number>>()

  for (const line of filteredLineList) {
    const { streamId, labelIdList, durationMs } = line

    if (!streamDurationMap.has(streamId)) {
      streamDurationMap.set(streamId, new Map())
    }

    const childMap = streamDurationMap.get(streamId)!

    for (const labelId of labelIdList) {
      childMap.set(labelId, (childMap.get(labelId) ?? 0) + durationMs)
    }
  }

  for (const entry of streamDurationMap.entries()) {
    const [streamId, labelDurationMap] = entry

    const stream = getStreamById({ doc, streamId })
    if (stream instanceof Error) {
      return stream
    }

    for (const [labelId, durationMs] of labelDurationMap.entries()) {
      const label = getLabelById({ doc, labelId })
      if (label instanceof Error) {
        return label
      }

      const duration = dateFns.formatDuration(
        dateFns.intervalToDuration({ start: 0, end: durationMs }),
        {
          format: ['days', 'hours', 'minutes'],
          locale: durationLocale,
        },
      )

      console.log(
        JSON.stringify({
          stream: stream.name,
          label: label.name,
          duration,
        }),
      )
    }
  }

  return undefined
}

const summaryCmd = new CliCommand('summary')
  .withDescription('Show summary of today')
  .withOptions(
    {
      name: ['-s', '--stream'],
      description: 'Filter points by a Stream ',
      args: [
        { name: 'name', description: 'Name of the stream', required: true },
      ],
    },
    {
      name: ['-v', '--label'],
      description: 'Filter points by a Label ',
      args: [
        { name: 'label', description: 'Label to filter by', required: true },
      ],
    },
    {
      name: ['-d', '--date'],
      description: 'Show points from a certain time',
      defaultValue: 'today',
      args: [
        {
          name: 'datetime',
          description: 'Date/time to show points from',
          required: true,
        },
      ],
    },
    {
      name: ['-p', '--span'],
      description: 'How many days to show',
      defaultValue: 1,
      args: [
        {
          name: 'days',
          description: 'Number of days',
          required: true,
        },
      ],
    },
  )
  .withHandler(async (_args, options, _extra) => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const timeZone = getUserTimeZone({ doc })

    const instant = chrono
      .parseDate(options.date, {
        instant: new Date(),
        timezone: timeZone,
      })
      ?.getTime()

    if (typeof instant !== 'number') {
      throw new Error(`Could not parse date: ${options.date}`)
    }

    const startDate = startOfDayWithTimeZone({
      instant,
      timeZone,
    }).getTime()

    const endDate = Math.min(
      dateFns.addDays(startDate, options.span).getTime(),
      Date.now(),
    )

    let whereStreamId: string | undefined
    if (options.stream) {
      const stream = getStreamByName({ doc, name: options.stream })
      if (stream instanceof Error) {
        throw stream
      }

      whereStreamId = stream.id
    }

    let whereLabelId: string | undefined
    if (options.label) {
      if (!whereStreamId) {
        throw new Error('Cannot filter by label without a stream')
      }

      const label = getLabelByName({
        doc,
        name: options.label,
        streamId: whereStreamId,
      })
      if (label instanceof Error) {
        throw label
      }

      whereLabelId = label.id
    }

    if (options.label && !whereLabelId) {
      throw new Error(`Label not found: ${options.label}`)
    }

    const result = handler({
      doc,
      where: { streamId: whereStreamId, labelId: whereLabelId },
      startDate,
      endDate,
    })

    if (result instanceof Error) {
      throw result
    }
  })

export { summaryCmd }
