import { errorBoundary } from '@stayradiated/error-boundary'

import type { KyselyDb } from '#lib/server/db/types.js'
import type { Stream } from '#lib/server/types.js'
import type { OmitTimestamps } from '#lib/utils/omit-timestamps.js'

type InsertStreamOptions = {
  db: KyselyDb
  set: OmitTimestamps<Stream>
  now?: number
}

const insertStream = async (
  options: InsertStreamOptions,
): Promise<Stream | Error> => {
  const { db, set, now = Date.now() } = options

  const value: Stream = {
    ...set,
    createdAt: now,
    updatedAt: now,
  }

  return errorBoundary(() =>
    db
      .insertInto('stream')
      .values(value)
      .returningAll()
      .executeTakeFirstOrThrow(),
  )
}

export { insertStream }
