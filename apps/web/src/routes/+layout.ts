import { error } from '@sveltejs/kit'

import type { UserId } from '#lib/ids.js'
import type { LayoutLoad } from './$types.js'

import { getReplicache } from '#lib/core/replicache/get-replicache.js'
import { createStore } from '#lib/core/replicache/store.js'

const load = (async () => {
  // const { sessionUserId } = data
  const sessionUserId = 'test' as UserId

  const rep = await getReplicache({
    sessionUserId,
  })
  if (rep instanceof Error) {
    throw error(500, rep)
  }

  const store = createStore({ rep })
  void rep.pull()

  return {
    store,
  }
}) satisfies LayoutLoad

export { load }

export const ssr = false
