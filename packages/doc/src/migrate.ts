import * as Y from 'yjs'
import type { Doc } from './types.js'

type MigrateOptions = {
  doc: Doc
}

const migrate = (options: MigrateOptions): void => {
  const { doc } = options

  const pointMap = doc.getMap('point')

  Y.transact(doc as Y.Doc, () => {
    // Make sure every point has a labelIdList
    for (const point of pointMap.values()) {
      if (!point.get('labelIdList')) {
        point.set('labelIdList', new Y.Array())
      }
    }
  })
}

export { migrate }
