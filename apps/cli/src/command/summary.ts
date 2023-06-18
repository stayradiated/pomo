import * as chrono from 'chrono-node'
import {
  getStreamIdByName,
  retrievePointList,
  getStreamNameById,
} from '@stayradiated/pomo-db'
import { CliCommand } from 'cilly'
import { startOfDay } from 'date-fns'
import type { KyselyDb } from '@stayradiated/pomo-db'
import { stripComments, mapPointListToLineList } from '@stayradiated/pomo-core'
import { getDb } from '#src/lib/db.js'

type HandlerOptions = {
  db: KyselyDb
  filter: {
    streamId: string | undefined
    value: string | undefined
  }
  currentTime: Date
}

const handler = async (options: HandlerOptions): Promise<void | Error> => {
  const { db, filter, currentTime } = options

  const pointList = await retrievePointList({
    db,
    since: startOfDay(currentTime),
    filter,
  })
  if (pointList instanceof Error) {
    return pointList
  }

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  const filterValue = filter.value
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
    const name = await getStreamNameById({ db, id: streamId })
    if (name instanceof Error) {
      return name
    }

    for (const [value, duration] of values.entries()) {
      const hours = Math.round(duration / 1000 / 60 / 60)
      const minutes = Math.round(duration / 1000 / 60) % 60
      const seconds = Math.round(duration / 1000) % 60

      console.log(
        JSON.stringify({
          stream: name,
          value,
          duration: `${hours}h ${minutes}m ${seconds}s`,
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
    const db = getDb()

    const currentTime = options['from']
      ? chrono.parseDate(options['from'])
      : new Date()

    if (currentTime instanceof Error) {
      throw currentTime
    }

    const filterStreamId = options['stream']
      ? await getStreamIdByName({ db, name: options['stream'] })
      : undefined

    if (filterStreamId instanceof Error) {
      throw new TypeError(
        `Could not find stream with name: ${options['stream']}`,
        {
          cause: filterStreamId,
        },
      )
    }

    return handler({
      db,
      filter: { streamId: filterStreamId, value: options['value'] },
      currentTime,
    })
  })

export { summaryCmd }
