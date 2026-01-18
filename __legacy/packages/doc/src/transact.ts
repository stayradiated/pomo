import * as Y from 'yjs'
import type { Doc } from './types.js'

const transact = <T>(
  doc: Doc,
  callback: () => T,
  origin?: any,
  local?: boolean,
): T => {
  return Y.transact(doc as Y.Doc, callback, origin, local)
}

export { transact }
