import { randomUUID } from 'node:crypto'
import type { KyselyDb } from './db.js'

type InsertPointOptions = {
  db: KyselyDb
  streamId: string
  value: string
  startedAt: number
}

const insertPoint = async (options: InsertPointOptions) => {
  const { db, streamId, value, startedAt } = options
  const createdAt = Date.now()

  await db
    .insertInto('Point')
    .values({
      id: randomUUID(),
      streamId,
      value,
      startedAt,
      createdAt,
    })
    .execute()
}

export { insertPoint }
