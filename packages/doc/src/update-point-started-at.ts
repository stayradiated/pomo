import Automerge from '@automerge/automerge'
import type { AutomergeDoc } from './types.js'

type UpdatePointStartedAtOptions = {
  doc: AutomergeDoc
  pointIdList: string[]
  startedAt: number
}

const updatePointStartedAt = (
  options: UpdatePointStartedAtOptions,
): AutomergeDoc => {
  const { doc, pointIdList, startedAt } = options

  return Automerge.change(doc, 'updatePointStartedAt', (doc) => {
    for (const pointId of pointIdList) {
      const point = doc.point[pointId]
      if (point) {
        point.startedAt = startedAt
      }
    }
  })
}

export { updatePointStartedAt }
