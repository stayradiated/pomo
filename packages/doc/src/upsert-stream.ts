import { randomUUID } from 'node:crypto'
import * as Y from 'yjs'
import { find } from './utils/find.js'
import type { Doc, YStream } from './types.js'

type UpsertStreamOptions = {
  doc: Doc
  name: string
  index?: number
  parentId?: string | null
}

const upsertStream = (options: UpsertStreamOptions): string => {
  const { doc, name, index, parentId = null } = options

  const streamMap = doc.getMap('stream')

  const existingStream = find(
    streamMap.values(),
    (stream: YStream) => stream.get('name') === name,
  )

  return Y.transact<string>(doc as Y.Doc, () => {
    if (existingStream) {
      let hasChanged = false

      if (typeof index === 'number') {
        existingStream.set('index', index)
        hasChanged = true
      }

      if (typeof parentId === 'string' || parentId === null) {
        existingStream.set('parentId', parentId)
        hasChanged = true
      }

      if (hasChanged) {
        existingStream.set('updatedAt', Date.now())
      }

      return existingStream.get('id')!
    }

    const streamId = randomUUID()
    const stream = new Y.Map() as YStream
    stream.set('id', streamId)
    stream.set('name', name)
    stream.set('index', index ?? 0)
    stream.set('parentId', parentId)
    stream.set('createdAt', Date.now())
    stream.set('updatedAt', null)
    streamMap.set(streamId, stream)
    return streamId
  })
}

export { upsertStream }
