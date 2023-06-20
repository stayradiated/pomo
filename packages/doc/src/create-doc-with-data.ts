import Automerge from '@automerge/automerge'
import type { Doc, AutomergeDoc } from './types.js'
import { createDoc } from './create-doc.js'

const createDocWithData = (data: Doc): AutomergeDoc => {
  const currentDoc = createDoc()

  return Automerge.change(currentDoc, (doc) => {
    doc.user = data.user
    doc.stream = data.stream
    doc.point = data.point
  })
}

export { createDocWithData }
