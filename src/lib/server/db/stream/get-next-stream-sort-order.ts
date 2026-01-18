import { errorBoundary } from '@stayradiated/error-boundary'

import type { UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'

type GetStreamVersionRecordOptions = {
  db: KyselyDb
  where: {
    userId: UserId
  }
}

const getNextStreamSortOrder = async (
  options: GetStreamVersionRecordOptions,
): Promise<number | Error> => {
  const { db, where } = options

  const row = await errorBoundary(() =>
    db
      .selectFrom('stream')
      .select((eb) =>
        eb.fn
          .coalesce(eb.fn.max<number | null>('sortOrder'), eb.lit(0))
          .as('maxSortOrder'),
      )
      .where('userId', '=', where.userId)
      .executeTakeFirstOrThrow(),
  )
  if (row instanceof Error) {
    return row
  }

  return row.maxSortOrder + 1
}

export { getNextStreamSortOrder }
