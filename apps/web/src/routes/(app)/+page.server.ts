import { error, redirect } from '@sveltejs/kit'

import type { Actions } from './$types.js'

import {
  deleteSessionTokenCookie,
  invalidateSession,
} from '#lib/server/auth.js'

import { getDb } from '#lib/server/db/get-db.js'

const actions = {
  logout: async (event) => {
    const { locals } = event
    const { session } = locals
    if (!session) {
      throw error(401, 'No session found')
    }

    const db = getDb()

    await invalidateSession(db, session.id)
    deleteSessionTokenCookie(event)

    throw redirect(302, '/login')
  },
} satisfies Actions

export { actions }
