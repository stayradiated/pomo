import { mockReplicache as replimock } from '@roughapp/replimock'

import type { Replicache } from '#lib/core/replicache/types.js'
import type { UserId } from '#lib/ids.js'

import {
  createReplicacheMutators,
  mutators,
} from '#lib/core/replicache/get-replicache.js'

import { getMinimalInitialData } from './get-minimal-initial-data.js'

type MockReplicacheOptions = {
  sessionUserId: UserId
}

/**
 * Create Replicache mock using mutators to generate realistic data
 * This approach uses the same business logic as production for data creation
 */
const mockReplicache = async (
  context: MockReplicacheOptions,
): Promise<Replicache> => {
  // Start with minimal initial data - just workspace and initial user
  const initialData = getMinimalInitialData(context)

  const rep = replimock({
    mutators: await createReplicacheMutators(context, mutators),
    initialData,
  })

  return rep
}

export { mockReplicache }
