import { errorBoundary } from '@stayradiated/error-boundary'

import type { KyselyDb } from '#lib/server/db/types.js'
import type { Label } from '#lib/server/types.js'
import type { OmitTimestamps } from '#lib/utils/omit-timestamps.js'

type InsertLabelOptions = {
  db: KyselyDb
  set: OmitTimestamps<Label>
  now?: number
}

const insertLabel = async (
  options: InsertLabelOptions,
): Promise<Label | Error> => {
  const { db, set, now = Date.now() } = options

  const value: Label = {
    ...set,
    createdAt: now,
    updatedAt: now,
  }

  return errorBoundary(() =>
    db
      .insertInto('label')
      .values(value)
      .returningAll()
      .executeTakeFirstOrThrow(),
  )
}

export { insertLabel }
