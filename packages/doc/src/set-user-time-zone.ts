import { randomUUID } from 'node:crypto'
import Automerge from '@automerge/automerge'
import type { AutomergeDoc } from './types.js'

type SetUserTimeZoneOptions = {
  doc: AutomergeDoc
  timeZone: string
}

const setUserTimeZone = (options: SetUserTimeZoneOptions): AutomergeDoc => {
  const { doc, timeZone } = options

  const now = Date.now()
  const userId = Object.keys(doc.user)[0] ?? randomUUID()

  return Automerge.change(doc, 'setUserTimeZone', (doc) => {
    const user = doc.user[userId]
    if (user) {
      user.timeZone = timeZone
      user.updatedAt = now
    } else {
      doc.user[userId] = {
        id: userId,
        timeZone,
        createdAt: now,
        updatedAt: now,
      }
    }
  })
}

export { setUserTimeZone }
