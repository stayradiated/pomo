import { randomUUID } from 'node:crypto'
import * as Y from 'yjs'
import { find } from '@vangware/iterables'
import type { Doc, YPoint } from './types.js'

type UpsertPointOptions = {
  doc: Doc
  streamId: string
  value: string
  startedAt: number
}

const upsertPoint = (options: UpsertPointOptions): string => {
  const { doc, streamId, value, startedAt } = options

  const pointMap = doc.getMap('point')

  const findPoint = find(
    (point: YPoint) =>
      point.get('streamId') === streamId &&
      point.get('startedAt') === startedAt,
  )

  const existingPoint = findPoint(pointMap.values())

  return Y.transact<string>(doc as Y.Doc, () => {
    if (existingPoint) {
      existingPoint.set('value', value)
      existingPoint.set('updatedAt', Date.now())
      return existingPoint.get('id')!
    }

    const pointId = randomUUID()
    const point = new Y.Map() as YPoint
    point.set('id', pointId)
    point.set('streamId', streamId)
    point.set('value', value)
    point.set('startedAt', startedAt)
    point.set('createdAt', Date.now())
    point.set('updatedAt', null)
    pointMap.set(pointId, point)
    return pointId
  })
}

export { upsertPoint }
