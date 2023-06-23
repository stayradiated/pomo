import { randomUUID } from 'node:crypto'
import * as Y from 'yjs'
import { find } from '@vangware/iterables'
import type { Doc, YStream } from './types.js'

type UpsertStreamOptions = {
  doc: Doc
  name: string
}

const upsertStream = (options: UpsertStreamOptions): string => {
  const { doc, name } = options

  const streamMap = doc.getMap('stream')

  const findStream = find((stream: YStream) => stream.get('name') === name)
  const existingStream = findStream(streamMap.values())

  return Y.transact<string>(doc as Y.Doc, () => {
    if (existingStream) {
      existingStream.set('name', name)
      existingStream.set('updatedAt', Date.now())
      return existingStream.get('id')!
    }

    const streamId = randomUUID()
    const stream = new Y.Map() as YStream
    stream.set('id', streamId)
    stream.set('name', name)
    stream.set('createdAt', Date.now())
    stream.set('updatedAt', null)
    streamMap.set(streamId, stream)
    return streamId
  })
}

export { upsertStream }
