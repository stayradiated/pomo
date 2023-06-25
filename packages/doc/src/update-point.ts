import * as Y from 'yjs'
import type { Doc } from './types.js'

type UpdatePointOptions = {
  doc: Doc
  pointId: string
  value?: string
  labelIdList?: string[]
}

const updatePoint = (options: UpdatePointOptions): void | Error => {
  const { doc, pointId, value, labelIdList } = options

  if (typeof value !== 'string' && !labelIdList) {
    return new Error('Either value or labelIdList must be provided')
  }

  const pointMap = doc.getMap('point')

  return Y.transact(doc as Y.Doc, (): void | Error => {
    const point = pointMap.get(pointId)

    if (!point) {
      return new Error(`Point ${pointId} not found`)
    }

    if (labelIdList) {
      point.set('labelIdList', Y.Array.from(labelIdList))
    }

    if (typeof value === 'string') {
      point.set('value', value)
    }

    point.set('updatedAt', Date.now())
  })
}

export { updatePoint }
