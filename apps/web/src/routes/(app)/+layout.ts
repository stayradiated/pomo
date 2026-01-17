import { error } from '@sveltejs/kit'

import type { LayoutLoad } from './$types.js'

import { getReplicache } from '#lib/core/replicache/get-replicache.js'
import { createStore } from '#lib/core/replicache/store.js'

const load = (async (event) => {
  const { sessionUserId } = event.data

  const rep = await getReplicache({ sessionUserId })
  if (rep instanceof Error) {
    throw error(500, rep)
  }

  const store = createStore({ rep, sessionUserId })
  void rep.pull()

  return {
    store,
  }
}) satisfies LayoutLoad

export { load }

// never sever side render this app
export const ssr = false
