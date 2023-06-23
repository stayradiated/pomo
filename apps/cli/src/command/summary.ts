import * as chrono from 'chrono-node'
import { CliCommand } from 'cilly'
import { startOfDay, intervalToDuration, formatDuration } from 'date-fns'
import {
  stripComments,
  mapPointListToLineList,
  durationLocale,
} from '@stayradiated/pomo-core'
import { proxy } from '#src/lib/proxy.js'

type HandlerOptions = {
  where: {
    streamId: string | undefined
    value: string | undefined
  }
  currentTime: Date
}

const handler = async (options: HandlerOptions): Promise<void | Error> => {
  const { where, currentTime } = options

  const pointList = await proxy.retrievePointList({
    since: startOfDay(currentTime).getTime(),
    where: {
      streamId: where.streamId,
    },
  })
  if (pointList instanceof Error) {
    return pointList
  }

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  const filterValue = where.value
  const filteredLineList =
    typeof filterValue === 'string'
      ? lineList.filter((line) => line.value.startsWith(filterValue))
      : lineList

  const totalDuration = new Map<string, Map<string, number>>()

  for (const line of filteredLineList) {
    const { streamId, value: rawValue, durationMs } = line
    const value = stripComments(rawValue)

    if (!totalDuration.has(streamId)) {
      totalDuration.set(streamId, new Map())
    }

    const childMap = totalDuration.get(streamId)!
    childMap.set(value, (childMap.get(value) ?? 0) + durationMs)
  }

  for (const entry of totalDuration.entries()) {
    const [streamId, values] = entry
    const name = await proxy.getStreamNameById({ id: streamId })

    for (const [value, durationMs] of values.entries()) {
      const duration = formatDuration(
        intervalToDuration({ start: 0, end: durationMs }),
        {
          format: ['hours', 'minutes'],
          locale: durationLocale,
        },
      )

      console.log(
        JSON.stringify({
          stream: name,
          value,
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
      name: ['-v', '--value'],
      description: 'Filter points by a Point value ',
      args: [
        { name: 'value', description: 'Value to filter by', required: true },
      ],
    },
    {
      name: ['-f', '--from'],
      description: 'Show points from a certain time',
      args: [
        {
          name: 'datetime',
          description: 'Date/time to show points from',
          required: true,
        },
      ],
    },
  )
  .withHandler(async (_args, options, _extra) => {
    const currentTime = options['from']
      ? chrono.parseDate(options['from'])
      : new Date()

    if (currentTime instanceof Error) {
      throw currentTime
    }

    const whereStreamId = options['stream']
      ? await proxy.getStreamIdByName({ name: options['stream'] })
      : undefined
    if (whereStreamId instanceof Error) {
      throw whereStreamId
    }

    const result = await handler({
      where: { streamId: whereStreamId, value: options['value'] },
      currentTime,
    })

    if (result instanceof Error) {
      throw result
    }
  })

export { summaryCmd }
