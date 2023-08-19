import { randomUlid } from './utils/ulid.js'
import * as Y from 'yjs'
import { head } from './utils/head.js'
import type { Doc, YUser } from './types.js'

type SetUserTimeZoneOptions = {
  doc: Doc
  timeZone: string
}

const setUserTimeZone = (options: SetUserTimeZoneOptions): void | Error => {
  const { doc, timeZone } = options

  if (!doc._transaction) {
    return new Error('Not in transaction')
  }

  const now = Date.now()

  const rootUserMap = doc.getMap('user')
  const user = head(rootUserMap.values())

  if (user) {
    user.set('timeZone', timeZone)
    user.set('updatedAt', now)
  } else {
    const userId = randomUlid()
    const user = new Y.Map() as YUser
    user.set('id', userId)
    user.set('timeZone', timeZone)
    user.set('createdAt', now)
    user.set('updatedAt', now)
    rootUserMap.set(userId, user)
  }
}

export { setUserTimeZone }
