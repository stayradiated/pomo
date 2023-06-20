import Automerge from '@automerge/automerge'
import type { Doc, AutomergeDoc } from './types.js'

const loadDoc = (byteArray: Uint8Array): AutomergeDoc => {
  const doc = Automerge.load<Doc>(byteArray)
  return doc
}

export { loadDoc }
