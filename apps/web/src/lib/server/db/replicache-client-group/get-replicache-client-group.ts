import { errorBoundary } from '@stayradiated/error-boundary'

import type { ReplicacheClientGroupId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { ReplicacheClientGroup } from '#lib/server/types.js'

type GetReplicacheClientGroupOptions = {
  db: KyselyDb
  where: {
    replicacheClientGroupId: ReplicacheClientGroupId
    userId: UserId
  }
  now?: number
}

const getReplicacheClientGroup = async (
  options: GetReplicacheClientGroupOptions,
): Promise<ReplicacheClientGroup | Error> => {
  const { db, where, now = Date.now() } = options

  const replicacheClientGroup = await errorBoundary(() =>
    db
      .selectFrom('replicacheClientGroup')
      .selectAll()
      .where('id', '=', where.replicacheClientGroupId)
      .executeTakeFirst(),
  )
  if (replicacheClientGroup instanceof Error) {
    return replicacheClientGroup
  }
  if (!replicacheClientGroup) {
    return {
      id: where.replicacheClientGroupId,
      userId: where.userId,
      cvrVersion: 0,
      createdAt: now,
      updatedAt: now,
    }
  }
  if (replicacheClientGroup.userId !== where.userId) {
    return new Error('ReplicacheClientGroupID is not owned by user.')
  }
  return replicacheClientGroup
}

export { getReplicacheClientGroup }
