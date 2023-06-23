import * as Y from 'yjs'
import { listOrError } from '@stayradiated/error-boundary'
import type { Doc } from './types.js'

type UpdatePointStartedAtOptions = {
  doc: Doc
  pointIdList: string[]
  startedAt: number
}

const updatePointStartedAt = (options: UpdatePointStartedAtOptions): void => {
  const { doc, pointIdList, startedAt } = options

  const pointMap = doc.getMap('point')

  const pointList = listOrError(
    pointIdList.map((pointId) => {
      const point = pointMap.get(pointId)
      if (!point) {
        return new Error(`Point ${pointId} not found`)
      }

      return point
    }),
  )

  if (pointList instanceof Error) {
    throw pointList
  }

  Y.transact(doc as Y.Doc, () => {
    const now = Date.now()
    for (const point of pointList) {
      point.set('startedAt', startedAt)
      point.set('updatedAt', now)
    }
  })
}

export { updatePointStartedAt }
