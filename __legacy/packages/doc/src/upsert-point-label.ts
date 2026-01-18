import type { Doc } from './types.js'

type UpsertPointLabelOptions = {
  doc: Doc
  pointId: string
  labelId: string
}

const upsertPointLabel = (
  options: UpsertPointLabelOptions,
): undefined | Error => {
  const { doc, pointId, labelId } = options

  if (!doc._transaction) {
    return new Error('Not in transaction')
  }

  const pointMap = doc.getMap('point')
  const point = pointMap.get(pointId)
  if (!point) {
    return new Error(`Point not found: ${pointId}`)
  }

  const labelIdList = point.get('labelIdList')!

  const hasLabel = labelIdList.toArray().includes(labelId)
  if (!hasLabel) {
    labelIdList.push([labelId])
    point.set('updatedAt', Date.now())
  }

  return
}

export { upsertPointLabel }
