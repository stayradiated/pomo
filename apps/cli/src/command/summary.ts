import * as chrono from 'chrono-node'
import { CliCommand } from 'cilly'
import * as dateFns from 'date-fns'
import {
  mapPointListToLineList,
  startOfDayWithTimeZone,
  durationLocale,
  clampLineList,
} from '@stayradiated/pomo-core'
import {
  getLabelIdByName,
  getLabelNameById,
  getStreamIdByName,
  getStreamNameById,
  retrievePointList,
  getUserTimeZone,
} from '@stayradiated/pomo-doc'
import type { Doc } from '@stayradiated/pomo-doc'
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

const handler = (options: HandlerOptions): void | Error => {
  const { doc, where, startDate, endDate } = options

  const pointList = retrievePointList({
    doc,
    startDate,
    endDate,
    where: {
      streamId: where.streamId,
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
    const name = getStreamNameById({ doc, streamId })

    for (const [labelId, durationMs] of labelDurationMap.entries()) {
      const labelName = getLabelNameById({ doc, labelId })

      const duration = dateFns.formatDuration(
        dateFns.intervalToDuration({ start: 0, end: durationMs }),
        {
          format: ['days', 'hours', 'minutes'],
          locale: durationLocale,
        },
      )

      console.log(
        JSON.stringify({
          stream: name,
          label: labelName,
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

    const startDate = startOfDayWithTimeZone({
      instant: chrono
        .parseDate(options['date'], {
          instant: new Date(),
          timezone: timeZone,
        })
        .getTime(),
      timeZone,
    }).getTime()

    const endDate = Math.min(
      dateFns.addDays(startDate, options['span']).getTime(),
      Date.now(),
    )

    const whereStreamId = options['stream']
      ? getStreamIdByName({ doc, name: options['stream'] })
      : undefined
    if (options['stream'] && !whereStreamId) {
      throw new Error(`Stream not found: ${options['stream']}`)
    }

    const whereLabelId =
      options['label'] && whereStreamId
        ? getLabelIdByName({
            doc,
            name: options['label'],
            streamId: whereStreamId,
          })
        : undefined
    if (options['label'] && !whereLabelId) {
      throw new Error(`Label not found: ${options['label']}`)
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
