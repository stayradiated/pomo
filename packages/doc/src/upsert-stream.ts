import { randomUUID } from 'node:crypto'
import Automerge from '@automerge/automerge'
import type { AutomergeDoc } from './types.js'

type UpsertStreamOptions = {
  doc: AutomergeDoc
  name: string
}

const upsertStream = (options: UpsertStreamOptions): AutomergeDoc => {
  const { doc, name } = options

  const id = randomUUID()

  return Automerge.change(doc, 'upsertStream', (doc) => {
    doc.stream[id] = {
      id,
      name,
      createdAt: Date.now(),
      updatedAt: null,
    }
  })
}

export { upsertStream }
