import { randomUUID } from 'node:crypto'
import Automerge from '@automerge/automerge'
import type { AutomergeDoc } from './types.js'

type UpsertPointOptions = {
  doc: AutomergeDoc
  streamId: string
  value: string
  startedAt: number
}

const upsertPoint = (options: UpsertPointOptions): AutomergeDoc => {
  const { doc, streamId, value, startedAt } = options

  return Automerge.change(doc, 'upsertPoint', (doc) => {
    const existingPoint = Object.values(doc.point).find(
      (point) => point.streamId === streamId && point.startedAt === startedAt,
    )

    if (existingPoint) {
      existingPoint.value = value
      existingPoint.updatedAt = Date.now()
      return
    }

    const id = randomUUID()
    doc.point[id] = {
      id,
      streamId,
      value,
      startedAt,
      createdAt: Date.now(),
      updatedAt: null,
    }
  })
}

export { upsertPoint }
