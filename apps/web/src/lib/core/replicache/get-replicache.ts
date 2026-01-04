import type { WriteTransaction } from 'replicache'
import { Replicache } from 'replicache'

import type { UserId } from '#lib/ids.js'
import type {
  GenericLocalMutator,
  InternalMutatorInput,
  LocalMutatorContext,
  LocalMutatorDefs,
  ReplicacheMutatorDefs,
} from '#lib/mutator/types.js'

import { memoize } from '#lib/utils/memoize.js'
import { asyncMapRecordValues } from '#lib/utils/record.js'

import { subscribeToWebSocketPokes } from './poke.js'

type LocalMutatorDefsImportMap<T extends LocalMutatorDefs = LocalMutatorDefs> =
  T extends T
    ? {
        [Key in keyof T & string]: Promise<{ default: T[Key] }>
      }
    : never

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

const mutators: LocalMutatorDefsImportMap = {
  ping: import('#lib/mutator/ping.js'),

  stream_create: import('#lib/mutator/stream-create.js'),
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
      schemaVersion: '2026.01.04/0',
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
