import type { KyselyDb } from "./db.js";
import { startOfToday, formatISO, parseISO, format } from "date-fns";

const stripComments = (input: string): string => {
  return input.replace(/\/\/.*/g, '').trim().split('\n')[0]!
}

const logCmd = async (db: KyselyDb) => {
  const since = formatISO(startOfToday())

  const logs = await db.selectFrom('StreamValue')
    .innerJoin('Stream', 'StreamValue.streamId', 'Stream.id')
    .select(['Stream.name', 'StreamValue.value', 'StreamValue.startedAt', 'StreamValue.stoppedAt'])
    .where('startedAt', '>=', since)
    .orderBy('startedAt', 'asc')
    .execute()

  for (const log of logs) {
    const { name, value: rawValue, startedAt: rawStartedAt, stoppedAt: rawStoppedAt } = log
    const value = stripComments(rawValue)
    const startedAt = parseISO(rawStartedAt)
    const stoppedAt = rawStoppedAt ? parseISO(rawStoppedAt) : undefined

    const duration = stoppedAt ? stoppedAt.getTime() - startedAt.getTime() : Date.now() - startedAt.getTime()
    const minutes = Math.round(duration / 1000 / 60)

    const date = format(startedAt, 'HH:mm')

    console.log(`${date}: ${name} → ${value} (${minutes}m)`)
  }
}

export { logCmd }
