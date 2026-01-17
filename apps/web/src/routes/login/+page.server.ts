import { error, redirect } from '@sveltejs/kit'

import type { UserId } from '#lib/ids.js'
import type { Actions, PageServerLoad } from './$types.js'

import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from '#lib/server/auth.js'

import { getDb } from '#lib/server/db/get-db.js'
import { ANY_ID } from '#lib/server/db/where.js'

import { getUser } from '#lib/server/db/user/get-user.js'
import { insertUser } from '#lib/server/db/user/insert-user.js'

import { genId } from '#lib/utils/gen-id.js'

const load = (async (event) => {
  const { locals } = event

  return {
    sessionUserId: locals.session?.userId,
  }
}) satisfies PageServerLoad

const actions = {
  login: async (event) => {
    const { request } = event
    const formData = await request.formData()
    const email = formData.get('email')
    const timeZone = formData.get('timeZone')

    if (typeof email !== 'string' || email.trim().length === 0) {
      return error(400, 'Email is required')
    }
    if (typeof timeZone !== 'string' || timeZone.trim().length === 0) {
      return error(400, 'Time zone is required')
    }

    const db = getDb()

    const existingUser = await getUser({
      db,
      where: { userId: ANY_ID, email },
    })
    if (existingUser instanceof Error) {
      return error(500, 'Failed to get user')
    }

    let userId: UserId
    if (existingUser) {
      userId = existingUser.id
    } else {
      const user = await insertUser({
        db,
        set: {
          id: genId(),
          timeZone,
          email,
          stravaClientId: null,
          stravaClientSecret: null,
          stravaSession: null,
        },
      })
      if (user instanceof Error) {
        return error(500, 'Failed to insert user')
      }
      userId = user.id
    }

    const sessionToken = generateSessionToken()
    const session = await createSession(db, sessionToken, userId)
    setSessionTokenCookie(event, sessionToken, session.expiresAt)
    return redirect(302, '/')
  },
} satisfies Actions

export { load, actions }
