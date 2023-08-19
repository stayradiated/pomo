import * as Y from 'yjs'
import type { Doc } from './types.js'

const applyUpdate = (doc: Doc, update: Uint8Array): void => {
  return Y.applyUpdateV2(doc as Y.Doc, update)
}

export { applyUpdate }
