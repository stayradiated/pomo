import { CliCommand } from 'cilly'
import * as chrono from 'chrono-node'
import {
  getStreamIdByName,
  retrievePointList,
  getStreamNameById,
} from '@stayradiated/pomo-db'
import { intervalToDuration, formatDuration } from 'date-fns'
import type { KyselyDb } from '@stayradiated/pomo-db'
import { mapPointListToLineList, stripComments } from '@stayradiated/pomo-core'
import { getDb } from '#src/lib/db.js'

type HandlerOptions = {
  db: KyselyDb
  filter: { streamId?: string }
  currentTime: Date
}

const handler = async (options: HandlerOptions): Promise<void | Error> => {
  const { db, currentTime, filter } = options

  const pointList = await retrievePointList({
    db,
    since: currentTime,
    filter,
  })
  if (pointList instanceof Error) {
    return pointList
  }

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  for (const line of lineList) {
    const streamName = await getStreamNameById({ db, id: line.streamId })
    if (streamName instanceof Error) {
      return streamName
    }

    const elapsed = intervalToDuration({
      start: line.startedAt,
      end: currentTime,
    })

    console.log(
      JSON.stringify({
        stream: streamName,
        value: stripComments(line.value),
        elapsed:
          formatDuration(elapsed, {
            format:
              elapsed.hours || elapsed.minutes
                ? ['hours', 'minutes']
                : ['seconds'],
          }) + ' ago',
      }),
    )
  }
}

const statusCmd = new CliCommand('status')
  .withDescription('Show current status')
  .withOptions(
    {
      name: ['-s', '--stream'],
      description: 'Filter points by a Stream ',
      args: [
        { name: 'name', description: 'Name of the stream', required: true },
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
      filter: { streamId: filterStreamId },
      currentTime,
    })
  })

export { statusCmd }
