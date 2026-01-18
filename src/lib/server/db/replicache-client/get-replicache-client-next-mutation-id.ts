import { errorBoundary } from '@stayradiated/error-boundary'

import type { ReplicacheClientGroupId, ReplicacheClientId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'

type GetReplicacheClientNextMutationIdOptions = {
  db: KyselyDb
  where: {
    replicacheClientId: ReplicacheClientId
    replicacheClientGroupId: ReplicacheClientGroupId
  }
}

const getReplicacheClientNextMutationId = async (
  options: GetReplicacheClientNextMutationIdOptions,
): Promise<number | Error> => {
  const { db, where } = options

  const replicacheClient = await errorBoundary(() =>
    db
      .selectFrom('replicacheClient')
      .selectAll()
      .where('id', '=', where.replicacheClientId)
      .executeTakeFirst(),
  )
  if (replicacheClient instanceof Error) {
    return replicacheClient
  }

  // client does not exist, so we default to 1
  if (!replicacheClient) {
    return 1
  }

  if (
    replicacheClient.replicacheClientGroupId !== where.replicacheClientGroupId
  ) {
    throw new Error(
      `ReplicacheClient "${where.replicacheClientId}" is not a member of ReplicacheClientGroup "${where.replicacheClientGroupId}".`,
    )
  }

  return replicacheClient.lastMutationId + 1
}

export { getReplicacheClientNextMutationId }
