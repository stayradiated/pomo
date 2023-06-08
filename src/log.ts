import * as process from 'node:process'
import { sql } from 'kysely'
import { startOfDay, formatISO, format } from 'date-fns'
import * as fastCSV from '@fast-csv/format'
import type { KyselyDb } from './db.js'
import { getNextValue, getTimings } from './stream.js'
import { stripComments } from './text.js'

type LogCmdOptions = {
  db: KyselyDb
  filter: {
    streamName: string | undefined
  }
  currentTime: Date
}

const logCmd = async (options: LogCmdOptions): Promise<void | Error> => {
  const { db, filter, currentTime } = options

  const since = formatISO(startOfDay(currentTime))

  const stream = fastCSV.format({ delimiter: ',' })
  stream.pipe(process.stdout)

  const streamValueList = await db
    .selectFrom('StreamValue')
    .innerJoin('Stream', 'StreamValue.streamId', 'Stream.id')
    .leftJoin(
      db
        .selectFrom('StreamValue')
        .select(['streamId', sql`MAX(startedAt)`.as('maxStartedAt')])
        .where('startedAt', '<', since)
        .groupBy('streamId')
        .as('sv2'),
      (join) =>
        join
          .onRef('StreamValue.streamId', '=', 'sv2.streamId')
          .onRef('StreamValue.startedAt', '=', 'sv2.maxStartedAt'),
    )
    .select([
      'Stream.name',
      'StreamValue.id',
      'StreamValue.startedAt',
      'StreamValue.streamId',
      'StreamValue.value',
    ])
    .where(({ or, cmpr }) =>
      or([
        cmpr('StreamValue.startedAt', '>', since),
        cmpr('sv2.streamId', 'is not', null),
      ]),
    )
    .$if(typeof filter.streamName === 'string', (qb) =>
      qb.where('Stream.name', '=', filter.streamName!),
    )
    .orderBy('StreamValue.startedAt', 'asc')
    .execute()

  for (const streamValue of streamValueList) {
    const nextStreamValue = getNextValue(streamValueList, streamValue)
    if (nextStreamValue instanceof Error) {
      return nextStreamValue
    }

    const { name, value: rawValue } = streamValue
    const value = stripComments(rawValue)

    const { startedAt, stoppedAt, durationMs } = getTimings(
      streamValue,
      nextStreamValue,
    )

    const minutes = Math.round(durationMs / 1000 / 60)

    const startedAtHHmm = format(startedAt, 'HH:mm')
    const stoppedAtHHmm = stoppedAt ? format(stoppedAt, 'HH:mm') : '--:--'

    stream.write([startedAtHHmm, stoppedAtHHmm, `${minutes}m`, name, value])
  }

  return undefined
}

export { logCmd }
