import * as Y from 'yjs'
import type { Doc, YUser } from './types.js'
import { head } from './utils/head.js'
import { randomUlid } from './utils/ulid.js'

type SetUserStravaSessionOptions = {
  doc: Doc
  session: {
    accessToken: string
    refreshToken: string
    expiresAt: number
  }
}

const setUserStravaSession = (
  options: SetUserStravaSessionOptions,
): undefined | Error => {
  const { doc, session } = options

  if (!doc._transaction) {
    return new Error('Not in transaction')
  }

  const now = Date.now()

  const rootUserMap = doc.getMap('user')
  const user = head(rootUserMap.values())

  if (user) {
    user.set('stravaSession', session)
    user.set('updatedAt', now)
  } else {
    const userId = randomUlid()
    const user = new Y.Map() as YUser
    user.set('id', userId)
    user.set('stravaSession', session)
    user.set('createdAt', now)
    user.set('updatedAt', now)
    rootUserMap.set(userId, user)
  }

  return
}

export { setUserStravaSession }
