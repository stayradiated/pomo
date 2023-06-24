import * as chrono from 'chrono-node'
import { CliCommand } from 'cilly'
import * as dateFns from 'date-fns'
import {
  stripComments,
  firstLine,
  mapPointListToLineList,
  startOfDayWithTimeZone,
  durationLocale,
} from '@stayradiated/pomo-core'
import { proxy } from '#src/lib/proxy.js'

type HandlerOptions = {
  where: {
    streamId: string | undefined
    value: string | undefined
  }
  startDate: number
  endDate: number
}

const handler = async (options: HandlerOptions): Promise<void | Error> => {
  const { where, startDate, endDate } = options

  const pointList = await proxy.retrievePointList({
    startDate,
    endDate,
    where: {
      streamId: where.streamId,
    },
  })
  if (pointList instanceof Error) {
    return pointList
  }

  console.log(JSON.stringify(pointList))


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
    const value = firstLine(stripComments(rawValue))

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
    const timeZone = await proxy.getUserTimeZone({})
    if (timeZone instanceof Error) {
      throw timeZone
    }

    const startDate = startOfDayWithTimeZone({
      instant: chrono
        .parseDate(options['date'], {
          instant: new Date(),
          timezone: timeZone,
        })
        .getTime(),
      timeZone,
    }).getTime()

    const endDate = dateFns.addDays(startDate, options['span']).getTime()

    const whereStreamId = options['stream']
      ? await proxy.getStreamIdByName({ name: options['stream'] })
      : undefined
    if (whereStreamId instanceof Error) {
      throw whereStreamId
    }
    if (options['stream'] && !whereStreamId) {
      throw new Error(`Stream not found: ${options['stream']}`)
    }

    const result = await handler({
      where: { streamId: whereStreamId, value: options['value'] },
      startDate,
      endDate,
    })

    if (result instanceof Error) {
      throw result
    }
  })

export { summaryCmd }
