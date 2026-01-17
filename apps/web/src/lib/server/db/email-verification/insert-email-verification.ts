import { errorBoundary } from '@stayradiated/error-boundary'

import type { KyselyDb } from '#lib/server/db/types.js'
import type { EmailVerification } from '#lib/server/types.js'
import type { OmitTimestamps } from '#lib/utils/omit-timestamps.js'

type InsertEmailVerificationOptions = {
  db: KyselyDb
  set: OmitTimestamps<EmailVerification>
  now?: number
}

const insertEmailVerification = async (
  options: InsertEmailVerificationOptions,
): Promise<EmailVerification | Error> => {
  const { db, set, now = Date.now() } = options

  const value: EmailVerification = {
    ...set,
    createdAt: now,
    updatedAt: now,
  }

  return errorBoundary(() =>
    db
      .insertInto('emailVerification')
      .values(value)
      .returningAll()
      .executeTakeFirstOrThrow(),
  )
}

export { insertEmailVerification }
