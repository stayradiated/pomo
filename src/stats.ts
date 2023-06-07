import { startOfToday, formatISO } from 'date-fns'
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

const statsCmd = async (db: KyselyDb): Promise<void | Error> => {
  const since = formatISO(startOfToday())

  const streamValueList = await db
    .selectFrom('StreamValue')
    .innerJoin('Stream', 'StreamValue.streamId', 'Stream.id')
    .select([
      'Stream.name',
      'StreamValue.id',
      'StreamValue.streamId',
      'StreamValue.value',
      'StreamValue.startedAt',
    ])
    .where('startedAt', '>=', since)
    .orderBy('startedAt', 'asc')
    .execute()

  const totalDuration: Record<string, Record<string, number>> = {}

  for (const streamValue of streamValueList) {
    const nextStreamValue = getNextValue(streamValueList, streamValue)
    if (nextStreamValue instanceof Error) {
      return nextStreamValue
    }

    const { name, value: rawValue } = streamValue
    const value = stripComments(rawValue)

    const { durationMs } = getTimings(streamValue, nextStreamValue)

    totalDuration[name] ??= {}
    totalDuration[name]![value] ??= 0
    totalDuration[name]![value] += durationMs
  }

  for (const [name, values] of Object.entries(totalDuration)) {
    console.log(`# ${name}`)
    for (const [value, duration] of Object.entries(values)) {
      const hours = Math.round(duration / 1000 / 60 / 60)
      const minutes = Math.round(duration / 1000 / 60) % 60
      console.log(`- ${value} (${hours}h${minutes}m)`)
    }
  }

  return undefined
}

export { statsCmd }
