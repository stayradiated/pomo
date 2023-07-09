import type { Doc } from './types.js'

type DeleteLabelsOptions = {
  doc: Doc
  pointIdList: string[]
}

const deletePoints = (options: DeleteLabelsOptions): void | Error => {
  const { doc, pointIdList } = options

  if (!doc._transaction) {
    return new Error('Not in transaction')
  }

  const pointMap = doc.getMap('point')

  // Validate that all labels exist
  for (const pointId of pointIdList) {
    const point = pointMap.get(pointId)
    if (!point) {
      return new Error(`Label ${pointId} not found`)
    }
  }

  for (const pointId of pointIdList) {
    pointMap.delete(pointId)
  }
}

export { deletePoints }
