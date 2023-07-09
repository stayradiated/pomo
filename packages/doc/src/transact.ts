import * as Y from 'yjs'
import type { Doc } from './types.js'

const transact = <T>(doc: Doc, callback: () => T): T => {
  return Y.transact(doc as Y.Doc, callback)
}

export { transact }
