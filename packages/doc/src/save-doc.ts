import Automerge from '@automerge/automerge'
import type { AutomergeDoc } from './types.js'

const saveDoc = (doc: AutomergeDoc): Uint8Array => {
  const byteArray = Automerge.save(doc)
  return byteArray
}

export { saveDoc }
