import { errorBoundary } from '@stayradiated/error-boundary'
import { sql } from 'kysely'

import type { UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { VersionRecord } from '#lib/server/replicache/cvr.js'

import { buildVersionRecord } from '#lib/server/replicache/cvr.js'

type GetUserVersionRecordOptions = {
  db: KyselyDb
  where: {
    userId: UserId
  }
}

const getUserVersionRecord = async (
  options: GetUserVersionRecordOptions,
): Promise<VersionRecord<UserId> | Error> => {
  const { db, where } = options

  const rowList = await errorBoundary(() =>
    db
      .selectFrom('user')
      .select('id')
      .select(() => sql<number>`xmin`.as('version'))
      .where('id', '=', where.userId)
      .execute(),
  )
  if (rowList instanceof Error) {
    return rowList
  }

  return buildVersionRecord(rowList)
}

export { getUserVersionRecord }
