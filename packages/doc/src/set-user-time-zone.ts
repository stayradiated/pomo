import { randomUUID } from 'node:crypto'
import * as Y from 'yjs'
import { head } from '@vangware/iterables'
import type { Doc, YUser } from './types.js'

type SetUserTimeZoneOptions = {
  doc: Doc
  timeZone: string
}

const setUserTimeZone = (options: SetUserTimeZoneOptions) => {
  const { doc, timeZone } = options

  const now = Date.now()

  const rootUserMap = doc.getMap('user')
  const user = head(rootUserMap.values())

  Y.transact(doc as Y.Doc, () => {
    if (user) {
      user.set('timeZone', timeZone)
      user.set('updatedAt', now)
    } else {
      const userId = randomUUID()
      const user = new Y.Map() as YUser
      user.set('id', userId)
      user.set('timeZone', timeZone)
      user.set('createdAt', now)
      user.set('updatedAt', now)
      rootUserMap.set(userId, user)
    }
  })
}

export { setUserTimeZone }
