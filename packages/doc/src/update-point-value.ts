import Automerge from '@automerge/automerge'
import type { AutomergeDoc } from './types.js'

type UpdatePointValueOptions = {
  doc: AutomergeDoc
  pointId: string
  value: string
}

const updatePointValue = (options: UpdatePointValueOptions): AutomergeDoc => {
  const { doc, pointId, value } = options

  const updatedAt = Date.now()

  return Automerge.change(doc, 'updatePointValue', (doc) => {
    const point = doc.point[pointId]
    if (point) {
      point.value = value
      point.updatedAt = updatedAt
    }
  })
}

export { updatePointValue }
