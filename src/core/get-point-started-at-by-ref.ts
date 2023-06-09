import { errorBoundary } from '@stayradiated/error-boundary'
import { parseISO } from 'date-fns'
import type { KyselyDb } from '#src/core/db.js'

type GetPointStartedAtByRefOptions = {
  db: KyselyDb
  ref: string
}

const getPointStartedAtByRef = async (
  options: GetPointStartedAtByRefOptions,
): Promise<Date | Error> => {
  const { db, ref } = options
  return errorBoundary(async () => {
    const row = await db
      .selectFrom('Point')
      .select('startedAt')
      .where('id', 'like', ref + '%')
      .executeTakeFirstOrThrow()
    return parseISO(row.startedAt)
  })
}

export { getPointStartedAtByRef }
