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

    // Make sure every label has a color prop
    for (const label of labelMap.values()) {
      const color = label.get('color')
      if (typeof color !== 'string' && color !== null) {
        label.set('color', null)
      }
    }
  })
}

export { migrate }
