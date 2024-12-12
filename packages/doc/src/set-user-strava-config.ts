import * as Y from 'yjs'
import type { Doc, YUser } from './types.js'
import { head } from './utils/head.js'
import { randomUlid } from './utils/ulid.js'

type SetUserStravaConfigOptions = {
  doc: Doc
  stravaConfig: {
    clientId: string
    clientSecret: string
  }
}

const setUserStravaConfig = (
  options: SetUserStravaConfigOptions,
): undefined | Error => {
  const { doc, stravaConfig } = options

  if (!doc._transaction) {
    return new Error('Not in transaction')
  }

  const now = Date.now()

  const rootUserMap = doc.getMap('user')
  const user = head(rootUserMap.values())

  if (user) {
    user.set('stravaClientId', stravaConfig.clientId)
    user.set('stravaClientSecret', stravaConfig.clientSecret)
    user.set('updatedAt', now)
  } else {
    const userId = randomUlid()
    const user = new Y.Map() as YUser
    user.set('id', userId)
    user.set('stravaClientId', stravaConfig.clientId)
    user.set('stravaClientSecret', stravaConfig.clientSecret)
    user.set('createdAt', now)
    user.set('updatedAt', now)
    rootUserMap.set(userId, user)
  }

  return
}

export { setUserStravaConfig }
