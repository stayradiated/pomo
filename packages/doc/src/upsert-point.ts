import { randomUUID } from 'node:crypto'
import * as Y from 'yjs'
import { find } from './utils/find.js'
import type { Doc, YPoint } from './types.js'

type UpsertPointOptions = {
  doc: Doc
  streamId: string
  startedAt: number

  value?: string
  labelIdList?: string[]
}

const upsertPoint = (options: UpsertPointOptions): string => {
  const { doc, streamId, value, startedAt, labelIdList } = options

  const pointMap = doc.getMap('point')

  if (typeof value !== 'string' && !Array.isArray(labelIdList)) {
    throw new TypeError('value or labelIdList must be provided')
  }

  const existingPoint = find(
    pointMap.values(),
    (point: YPoint) =>
      point.get('streamId') === streamId &&
      point.get('startedAt') === startedAt,
  )

  return Y.transact<string>(doc as Y.Doc, () => {
    if (existingPoint) {
      if (typeof value === 'string') {
        existingPoint.set('value', value)
      }

      if (Array.isArray(labelIdList)) {
        existingPoint.get('labelIdList')!.push(labelIdList)
      }

      existingPoint.set('updatedAt', Date.now())
      return existingPoint.get('id')!
    }

    const pointId = randomUUID()
    const point = new Y.Map() as YPoint
    point.set('id', pointId)
    point.set('streamId', streamId)
    point.set('value', value ?? '')
    point.set('labelIdList', Y.Array.from(labelIdList ?? []))
    point.set('startedAt', startedAt)
    point.set('createdAt', Date.now())
    point.set('updatedAt', null)
    pointMap.set(pointId, point)
    return pointId
  })
}

export { upsertPoint }
