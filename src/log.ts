import { startOfToday, formatISO, format } from 'date-fns'
import type { KyselyDb } from './db.js'
import { getNextValue, getTimings } from './stream.js'

const stripComments = (input: string): string => {
  return (
    input
      // Strip html comments from string javas
      .replace(/<!--[\s\S]*?-->/g, '')
      // Strip c-style comments from string
      .replace(/\/\/.*/g, '')
      .trim()
      .split('\n')[0]!
  )
}

const logCmd = async (db: KyselyDb): Promise<void | Error> => {
  const since = formatISO(startOfToday())

  const streamValueList = await db
    .selectFrom('StreamValue')
    .innerJoin('Stream', 'StreamValue.streamId', 'Stream.id')
    .select([
      'Stream.name',
      'StreamValue.id',
      'StreamValue.startedAt',
      'StreamValue.streamId',
      'StreamValue.value',
    ])
    .where('startedAt', '>=', since)
    .orderBy('startedAt', 'asc')
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

    console.log(
      `${startedAtHHmm}, ${stoppedAtHHmm}, ${minutes}m, ${name}, ${value}`,
    )
  }

  return undefined
}

export { logCmd }
