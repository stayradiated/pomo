import { errorBoundary } from '@stayradiated/error-boundary'

import type { ReplicacheClientGroupId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { ReplicacheClientGroup } from '#lib/server/types.js'

type UpsertReplicacheClientGroupOptions = {
  db: KyselyDb
  where: {
    replicacheClientGroupId: ReplicacheClientGroupId
  }
  set: {
    userId: UserId
    cvrVersion: number
  }
  now?: number
}

const upsertReplicacheClientGroup = async (
  options: UpsertReplicacheClientGroupOptions,
) => {
  const { db, where, set, now = Date.now() } = options

  const value: ReplicacheClientGroup = {
    id: where.replicacheClientGroupId,
    userId: set.userId,
    cvrVersion: set.cvrVersion,
    createdAt: now,
    updatedAt: now,
  }

  const result = await errorBoundary(() =>
    db
      .insertInto('replicacheClientGroup')
      .values(value)
      .onConflict((ocb) =>
        ocb.column('id').doUpdateSet({
          ...set,
          updatedAt: now,
        }),
      )
      .executeTakeFirst(),
  )

  if (result instanceof Error) {
    return result
  }
}

export { upsertReplicacheClientGroup }
