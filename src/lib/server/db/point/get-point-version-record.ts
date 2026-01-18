import { errorBoundary } from '@stayradiated/error-boundary'
import { sql } from 'kysely'

import type { PointId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { VersionRecord } from '#lib/server/replicache/cvr.js'

import { buildVersionRecord } from '#lib/server/replicache/cvr.js'

type GetPointVersionRecordOptions = {
  db: KyselyDb
  where: {
    userId: UserId
  }
}

const getPointVersionRecord = async (
  options: GetPointVersionRecordOptions,
): Promise<VersionRecord<PointId> | Error> => {
  const { db, where } = options

  const rowList = await errorBoundary(() =>
    db
      .selectFrom('point')
      .select('id')
      .select(() => sql<number>`xmin`.as('version'))
      .where('userId', '=', where.userId)
      .execute(),
  )
  if (rowList instanceof Error) {
    return rowList
  }

  return buildVersionRecord(rowList)
}

export { getPointVersionRecord }
