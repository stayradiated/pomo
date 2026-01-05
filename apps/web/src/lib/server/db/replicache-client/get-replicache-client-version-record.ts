import { errorBoundary } from '@stayradiated/error-boundary'

import type { ReplicacheClientGroupId, ReplicacheClientId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { VersionRecord } from '#lib/server/replicache/cvr.js'

import { buildVersionRecord } from '#lib/server/replicache/cvr.js'

type GetReplicacheClientVersionsOptions = {
  db: KyselyDb
  where: {
    replicacheClientGroupId: ReplicacheClientGroupId
  }
}

const getReplicacheClientVersionRecord = async (
  options: GetReplicacheClientVersionsOptions,
): Promise<VersionRecord<ReplicacheClientId> | Error> => {
  const { db, where } = options

  const rowList = await errorBoundary(() =>
    db
      .selectFrom('replicacheClient')
      .select(['id', 'lastMutationId as version'])
      .where('replicacheClientGroupId', '=', where.replicacheClientGroupId)
      .execute(),
  )
  if (rowList instanceof Error) {
    return rowList
  }

  return buildVersionRecord(rowList)
}

export { getReplicacheClientVersionRecord }
