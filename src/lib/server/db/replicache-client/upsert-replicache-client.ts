import { errorBoundary } from '@stayradiated/error-boundary'

import type { ReplicacheClientGroupId, ReplicacheClientId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { ReplicacheClient } from '#lib/server/types.js'

type UpsertReplicacheClientOptions = {
  db: KyselyDb
  where: {
    replicacheClientId: ReplicacheClientId
  }
  set: {
    replicacheClientGroupId: ReplicacheClientGroupId
    lastMutationId: number
  }
  now?: number
}

const upsertReplicacheClient = async (
  options: UpsertReplicacheClientOptions,
): Promise<void | Error> => {
  const { db, where, set, now = Date.now() } = options

  const value: ReplicacheClient = {
    id: where.replicacheClientId,
    replicacheClientGroupId: set.replicacheClientGroupId,
    lastMutationId: set.lastMutationId,
    createdAt: now,
    updatedAt: now,
  }

  const result = await errorBoundary(() =>
    db
      .insertInto('replicacheClient')
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

export { upsertReplicacheClient }
