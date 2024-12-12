import * as Y from 'yjs'
import type { Doc, YPoint } from './types.js'

type MigrateOptions = {
  doc: Doc
}

const migrate = (options: MigrateOptions): undefined | Error => {
  const { doc } = options

  if (!doc._transaction) {
    return new Error('Not in transaction')
  }

  const pointMap = doc.getMap('point')
  const streamMap = doc.getMap('stream')
  const labelMap = doc.getMap('label')

  const streamPointStartedAtMap = new Map<string, Map<number, YPoint>>()

  for (const point of pointMap.values()) {
    // Make sure every point has a labelIdList
    if (!point.get('labelIdList')) {
      point.set('labelIdList', new Y.Array())
    }

    // Make sure every point has a unique (streamId, startedAt) pair
    const streamId = point.get('streamId')!
    const startedAt = point.get('startedAt')!
    const streamPointStartedAt = streamPointStartedAtMap.get(streamId)
    if (streamPointStartedAt) {
      if (streamPointStartedAt.has(startedAt)) {
        const pointB = streamPointStartedAt.get(startedAt)!

        const [pointToKeep, pointToDelete] =
          Math.max(pointB.get('updatedAt')!, pointB.get('createdAt')!) >
          Math.max(point.get('updatedAt')!, point.get('createdAt')!)
            ? [pointB, point]
            : [point, pointB]

        streamPointStartedAt.set(startedAt, pointToKeep)
        pointMap.delete(pointToDelete.get('id')!)
      }

      streamPointStartedAt.set(startedAt, point)
    } else {
      streamPointStartedAtMap.set(streamId, new Map([[startedAt, point]]))
    }
  }

  for (const stream of streamMap.values()) {
    const index = stream.get('index')
    if (typeof index !== 'number') {
      stream.set('index', 0)
    }

    const parentId = stream.get('parentId')
    if (typeof parentId !== 'string' && parentId !== null) {
      stream.set('parentId', null)
    }
  }

  for (const label of labelMap.values()) {
    const name = label.get('name')
    const trimmedName = typeof name === 'string' ? name.trim() : ''
    if (trimmedName !== name) {
      label.set('name', trimmedName)
    }

    const color = label.get('color')
    if (typeof color !== 'string' && color !== null) {
      label.set('color', null)
    }

    const icon = label.get('icon')
    if (typeof icon !== 'string' && icon !== null) {
      label.set('icon', null)
    }

    const parentId = label.get('parentId')
    if (typeof parentId !== 'string' && parentId !== null) {
      label.set('parentId', null)
    }
  }

  return
}

export { migrate }
