import * as Y from 'yjs'
import type { Doc } from './types.js'

type UpsertPointLabelOptions = {
  doc: Doc
  pointId: string
  labelId: string
}

const upsertPointLabel = (options: UpsertPointLabelOptions): void => {
  const { doc, pointId, labelId } = options

  const pointMap = doc.getMap('point')
  const point = pointMap.get(pointId)
  if (!point) {
    throw new Error(`Point not found: ${pointId}`)
  }

  Y.transact(doc as Y.Doc, () => {
    const labelIdList = point.get('labelIdList')!

    const hasLabel = labelIdList.toArray().includes(labelId)
    if (!hasLabel) {
      labelIdList.push([labelId])
      point.set('updatedAt', Date.now())
    }
  })
}

export { upsertPointLabel }
