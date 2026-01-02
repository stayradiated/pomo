import type { Signal } from 'signia'
import { transact } from 'signia'

import type {
  AnonLabel,
  AnonPoint,
  AnonStream,
  AnonUser,
  Replicache,
} from '#lib/core/replicache/types.js'
import type { LabelId, PointId, StreamId, UserId } from '#lib/ids.js'
import type { InternalMutatorInput } from '#lib/mutator/types.js'
import type { Label, Point, Stream, User } from '#lib/types.local.js'

import * as Key from '#lib/core/replicache/keys.js'
import { Table } from '#lib/core/replicache/table/table.js'

import { groupBy } from '#lib/utils/group-by.js'
import { memoize } from '#lib/utils/memoize'
import { mapRecordValues } from '#lib/utils/record.js'

type CreateStoreOptions = {
  rep: Replicache
}

const createStore = (options: CreateStoreOptions) => {
  const { rep } = options

  const label = new Table<LabelId, AnonLabel, Label>({
    key: Key.label,
    mapValue: (value, id) => ({ id, ...value }),
  })
  const stream = new Table<StreamId, AnonStream, Stream>({
    key: Key.stream,
    mapValue: (value, id) => ({ id, ...value }),
  })
  const point = new Table<PointId, AnonPoint, Point>({
    key: Key.point,
    mapValue: (value, id) => ({ id, ...value }),
  })
  const user = new Table<UserId, AnonUser, User>({
    key: Key.user,
    mapValue: (value, id) => ({ id, ...value }),
  })

  // biome-ignore lint/suspicious/noExplicitAny: this is fine
  const tableByName: Record<string, Table<any, any, any>> = {
    [Key.point.name]: point,
    [Key.label.name]: label,
    [Key.stream.name]: stream,
    [Key.user.name]: user,
  }

  rep.experimentalWatch(
    (diffList) => {
      const record = groupBy(diffList, (diff) => {
        const match = diff.key.match(/^(\w+)\//)
        const name = match?.[1]
        return name ?? ''
      })

      transact(() => {
        for (const [name, diffList] of Object.entries(record)) {
          const table = tableByName[name]
          if (!table) {
            console.warn(`No table for "${name}"`)
            continue
          }
          table.pushDiffList(diffList)
        }
      })
    },
    {
      initialValuesInFirstDiff: true,
    },
  )

  // whatever we return here _is_ the typeof store
  return {
    id: rep.clientID,
    rep: rep,

    label,
    point,
    stream,
    user,

    mutate: mapRecordValues(
      rep.mutate,
      (fn) => (input: InternalMutatorInput) => {
        return (fn as (input: InternalMutatorInput) => Promise<void>)({
          ...input,
          // we track thse values inside the replicache mutation
          // so that they are persisted between replays
          // and also comitted to the server correctly
          context: {
            ...input.context,
            actionedAt: input.context?.actionedAt ?? Date.now(),
          },
        })
      },
    ) as typeof rep.mutate,
  }
}

type Store = ReturnType<typeof createStore>

type WithStoreOptions<Args extends unknown[]> = {
  cacheKey?: (args: Args) => string
}

const memoizeWithStore = <
  Args extends unknown[],
  Result extends Signal<unknown>,
>(
  _debugName: string,
  fn: (store: Store, ...args: Args) => Result,
  options: WithStoreOptions<Args> = {},
) => {
  const cacheKey = options.cacheKey ?? ((args) => args.join('|'))
  return memoize(
    (store: Store, ...args: Args) => {
      // console.log(`memoizeWithStore(${_debugName}, ${cacheKey(args)})`)
      return fn(store, ...args)
    },
    {
      cacheKey: ([store, ...args]) => `${store.id}|${cacheKey(args)}`,
      // use a separate cache for each store
      cache: new Map(),
    },
  )
}

export { createStore, memoizeWithStore }
export type { Store }
