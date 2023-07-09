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

const upsertPoint = (options: UpsertPointOptions): string | Error => {
  const { doc, streamId, value, startedAt, labelIdList } = options

  if (!doc._transaction) {
    return new Error('Not in transaction')
  }

  const pointMap = doc.getMap('point')

  if (typeof value !== 'string' && !Array.isArray(labelIdList)) {
    return new TypeError('value or labelIdList must be provided')
  }

  const existingPoint = find(
    pointMap.values(),
    (point: YPoint) =>
      point.get('streamId') === streamId &&
      point.get('startedAt') === startedAt,
  )

  if (existingPoint) {
    let hasChanged = false

    if (typeof value === 'string') {
      existingPoint.set('value', value)
      hasChanged = true
    }

    if (Array.isArray(labelIdList)) {
      const existingLabelIdList = existingPoint.get('labelIdList')!
      const existingLabelIdListArray = existingLabelIdList.toArray()
      for (const item of labelIdList) {
        if (!existingLabelIdListArray.includes(item)) {
          existingLabelIdList.push([item])
          hasChanged = true
        }
      }
    }

    if (hasChanged) {
      existingPoint.set('updatedAt', Date.now())
    }

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
}

export { upsertPoint }
