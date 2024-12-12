import { createDoc } from '@stayradiated/pomo-doc'
import type { Doc } from '@stayradiated/pomo-doc'
import { IndexeddbPersistence } from './y-indexeddb.js'
import { once } from './once.js'
import { markDocAsStale } from './sync.js'

const getDoc = once(() => {
  return new Promise<Doc>((resolve) => {
    const doc = createDoc()
    const provider = new IndexeddbPersistence('pomo', doc)
    provider.once('synced', () => {
      resolve(doc)
    })

    void markDocAsStale(doc)
  })
})

export { getDoc }
