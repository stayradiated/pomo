import { applyUpdate } from './apply-update.js'
import { createDoc } from './create-doc.js'
import type { Doc } from './types.js'

const loadDoc = (byteArray: Uint8Array): Doc => {
  const doc = createDoc()
  applyUpdate(doc, byteArray)
  return doc
}

export { loadDoc }
