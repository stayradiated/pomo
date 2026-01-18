import * as Y from 'yjs'
import type { Doc } from './types.js'

const encodeStateAsUpdate = (
  doc: Doc,
  remoteStateVector?: Uint8Array,
): Uint8Array => {
  const byteArray = Y.encodeStateAsUpdateV2(doc as Y.Doc, remoteStateVector)
  return byteArray
}

export { encodeStateAsUpdate }
