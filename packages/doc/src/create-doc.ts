import * as Automerge from '@automerge/automerge'
import type { Doc, AutomergeDoc } from './types.js'

const createDoc = (): AutomergeDoc => {
  const schema = Automerge.change(
    Automerge.init<Doc>('0000'),
    { time: 0 },
    (doc) => {
      doc.user = {}
      doc.point = {}
      doc.stream = {}
    },
  )

  const initChange = Automerge.getLastLocalChange(schema) as AutomergeDoc
  const [doc] = Automerge.applyChanges(Automerge.init<Doc>(), [initChange])

  return doc
}

export { createDoc }
