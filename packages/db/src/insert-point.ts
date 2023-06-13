import { randomUUID } from 'node:crypto'
import type { KyselyDb } from './db.js'

type InsertPointOptions = {
  db: KyselyDb,
  streamId: string,
  value: string,
  startedAt: Date,
}

const insertPoint = async (options: InsertPointOptions) => {
  const { db, streamId, value, startedAt } = options

  await db
    .insertInto('Point')
    .values({
      id: randomUUID(),
      streamId,
      value,
      startedAt: startedAt.toISOString(),
    })
    .execute()
}

export { insertPoint }
