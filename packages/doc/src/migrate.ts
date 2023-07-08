import * as Y from 'yjs'
import type { Doc } from './types.js'

type MigrateOptions = {
  doc: Doc
}

const migrate = (options: MigrateOptions): void => {
  const { doc } = options

  const pointMap = doc.getMap('point')
  const streamMap = doc.getMap('stream')
  const labelMap = doc.getMap('label')

  Y.transact(doc as Y.Doc, () => {
    // Make sure every point has a labelIdList
    for (const point of pointMap.values()) {
      if (!point.get('labelIdList')) {
        point.set('labelIdList', new Y.Array())
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
  })
}

export { migrate }
