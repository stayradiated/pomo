import * as Y from 'yjs'
import type { Doc } from './types.js'
import { createDoc } from './create-doc.js'

const loadDoc = (byteArray: Uint8Array): Doc => {
  const doc = createDoc()
  Y.applyUpdateV2(doc as Y.Doc, byteArray)
  return doc
}

export { loadDoc }
