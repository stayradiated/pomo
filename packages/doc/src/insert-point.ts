import { randomUUID } from 'node:crypto'
import Automerge from '@automerge/automerge'
import type { AutomergeDoc } from './types.js'

type InsertPointOptions = {
  doc: AutomergeDoc
  streamId: string
  value: string
  startedAt: number
}

const insertPoint = (options: InsertPointOptions): AutomergeDoc => {
  const { doc, streamId, value, startedAt } = options
  const createdAt = Date.now()

  const id = randomUUID()

  return Automerge.change(doc, 'insertPoint', (doc) => {
    doc.point[id] = {
      id,
      streamId,
      value,
      startedAt,
      createdAt,
      updatedAt: null,
    }
  })
}

export { insertPoint }
