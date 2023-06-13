import { randomUUID } from 'node:crypto'
import type { KyselyDb } from './db.js'

type UpsertStreamOptions = {
  db: KyselyDb,
  name: string
}

const upsertStream = async (options: UpsertStreamOptions) => {
  const { db, name } = options

  await db
      .insertInto('Stream')
      .values({ id: randomUUID(), name })
      .onConflict((oc) => oc.column('name').doNothing())
      .execute()
}

export { upsertStream }
