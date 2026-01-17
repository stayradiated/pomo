import { error } from '@sveltejs/kit'

import type { LayoutServerLoad } from './$types.js'

const load = (async (event) => {
  const { locals } = event
  const { session } = locals

  if (!session) {
    throw error(401, 'No session found')
  }

  return {
    sessionUserId: session?.userId,
  }
}) satisfies LayoutServerLoad

export { load }
