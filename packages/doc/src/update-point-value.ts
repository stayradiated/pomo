import * as Y from 'yjs'
import type { Doc } from './types.js'

type UpdatePointValueOptions = {
  doc: Doc
  pointId: string
  value: string
}

const updatePointValue = (options: UpdatePointValueOptions): void | Error => {
  const { doc, pointId, value } = options

  const pointMap = doc.getMap('point')

  return Y.transact(doc as Y.Doc, (): void | Error => {
    const point = pointMap.get(pointId)

    if (!point) {
      return new Error(`Point ${pointId} not found`)
    }

    point.set('value', value)
    point.set('updatedAt', Date.now())
  })
}

export { updatePointValue }
