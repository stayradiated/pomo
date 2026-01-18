import type { WriteTransaction } from 'replicache'
import { Replicache } from 'replicache'

import type { UserId } from '#lib/ids.js'
import type {
  GenericLocalMutator,
  InternalMutatorInput,
  LocalMutatorContext,
  LocalMutatorDefsImportMap,
  ReplicacheMutatorDefs,
} from '#lib/mutator/types.js'

import { memoize } from '#lib/utils/memoize.js'
import { asyncMapRecordValues } from '#lib/utils/record.js'

import { mutators } from '#lib/mutator/index.js'

import { subscribeToWebSocketPokes } from './poke.js'

const createReplicacheMutators = async (
  initialContext: Omit<LocalMutatorContext, 'tx' | 'actionedAt'>,
  localMutatorDefs: LocalMutatorDefsImportMap,
): Promise<ReplicacheMutatorDefs> => {
  return asyncMapRecordValues(
    localMutatorDefs,
    async (untypedMutatorPromise) => {
      const mutator = (await untypedMutatorPromise)
        .default as GenericLocalMutator<unknown>

      return async (tx: WriteTransaction, args: unknown) => {
        const { context, ...input } = args as InternalMutatorInput
        const localContext = {
          ...initialContext,
          tx,
          actionedAt: context?.actionedAt ?? Date.now(),
        }
        const result = await mutator(localContext, input)
        if (result instanceof Error) {
          throw result
        }
        return result
      }
    },
  ) as Promise<ReplicacheMutatorDefs>
}

type GetReplicacheOptions = {
  sessionUserId: UserId
}

const getReplicache = memoize(
  async (
    options: GetReplicacheOptions,
  ): Promise<Replicache<ReplicacheMutatorDefs> | Error> => {
    const { sessionUserId } = options

    if (!sessionUserId) {
      return new Error('sessionUserId are required')
    }

    const context = { sessionUserId }

    const replicache = new Replicache<ReplicacheMutatorDefs>({
      schemaVersion: '2026.01.17/0',
      name: sessionUserId,
      pushURL: '/api/internal/replicache/push',
      pullURL: '/api/internal/replicache/pull',
      mutators: await createReplicacheMutators(context, mutators),
    })

    // Use WebSocket-based poke subscription
    console.info('[Replicache] Using WebSocket poke subscription')
    const subscription = subscribeToWebSocketPokes({
      onPoke: () => replicache.pull(),
    })
    if (subscription instanceof Error) {
      return subscription
    }

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        replicache.close()
      })
    }

    return replicache
  },
  {
    cacheKey: ([options]) => options.sessionUserId,
  },
)

export { getReplicache, mutators, createReplicacheMutators }
