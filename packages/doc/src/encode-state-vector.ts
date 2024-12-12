import * as Y from 'yjs'
import type { Doc } from './types.js'

const encodeStateVector = (doc: Doc): Uint8Array<ArrayBufferLike> => {
  const vector = Y.encodeStateVector(doc as Y.Doc)
  return vector
}

export { encodeStateVector }
