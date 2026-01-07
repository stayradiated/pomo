import type { Signal } from 'signia'

import type { Store } from '#lib/core/replicache/store.js'

import { memoize } from '#lib/utils/memoize'

type WithStoreOptions<Args extends unknown[]> = {
  cacheKey: (args: Args) => string
}

const createSelector = <Args extends unknown[], Result extends Signal<unknown>>(
  _debugName: string,
  fn: (store: Store, ...args: Args) => Result,
  options: WithStoreOptions<Args> = {
    cacheKey: JSON.stringify,
  },
) => {
  const { cacheKey } = options
  return memoize(
    (store: Store, ...args: Args) => {
      return fn(store, ...args)
    },
    {
      cacheKey: ([store, ...args]) => `${store.id}|${cacheKey(args)}`,
      // use a separate cache for each store
      cache: new Map(),
    },
  )
}

export { createSelector }
