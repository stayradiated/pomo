import type { Doc } from './types.js'
import { createDoc } from './create-doc.js'
import { applyUpdate } from './apply-update.js'

const loadDoc = (byteArray: Uint8Array): Doc => {
  const doc = createDoc()
  applyUpdate(doc, byteArray)
  return doc
}

export { loadDoc }
