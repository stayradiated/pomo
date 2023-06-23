import * as Y from 'yjs'
import type { Doc } from './types.js'

const saveDoc = (doc: Doc): Uint8Array => {
  console.time('save')
  const byteArray = Y.encodeStateAsUpdate(doc as Y.Doc)
  console.timeEnd('save')
  return byteArray
}

export { saveDoc }
