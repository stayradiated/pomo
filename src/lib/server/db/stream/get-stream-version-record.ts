import { errorBoundary } from '@stayradiated/error-boundary'
import { sql } from 'kysely'

import type { StreamId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { VersionRecord } from '#lib/server/replicache/cvr.js'

import { buildVersionRecord } from '#lib/server/replicache/cvr.js'

type GetStreamVersionRecordOptions = {
  db: KyselyDb
  where: {
    userId: UserId
  }
}

const getStreamVersionRecord = async (
  options: GetStreamVersionRecordOptions,
): Promise<VersionRecord<StreamId> | Error> => {
  const { db, where } = options

  const rowList = await errorBoundary(() =>
    db
      .selectFrom('stream')
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

export { getStreamVersionRecord }
