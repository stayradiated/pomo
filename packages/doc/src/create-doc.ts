import * as Y from 'yjs'
import type { Doc } from './types.js'

const createDoc = (): Doc => {
  const doc = new Y.Doc() as Doc
  return doc
}

export { createDoc }
