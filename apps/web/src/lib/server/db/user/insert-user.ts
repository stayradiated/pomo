import { errorBoundary } from '@stayradiated/error-boundary'

import type { KyselyDb } from '#lib/server/db/types.js'
import type { User } from '#lib/server/types.js'
import type { OmitTimestamps } from '#lib/utils/omit-timestamps.js'

type InsertUserOptions = {
  db: KyselyDb
  set: OmitTimestamps<User>
  now?: number
}

const insertUser = async (
  options: InsertUserOptions,
): Promise<User | Error> => {
  const { db, set, now = Date.now() } = options

  const value: User = {
    ...set,
    createdAt: now,
    updatedAt: now,
  }

  return errorBoundary(() =>
    db
      .insertInto('user')
      .values(value)
      .returningAll()
      .executeTakeFirstOrThrow(),
  )
}

export { insertUser }
