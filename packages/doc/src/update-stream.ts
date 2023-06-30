import * as Y from 'yjs'
import type { Doc } from './types.js'

type UpdateStreamOptions = {
  doc: Doc
  streamId: string
  name?: string
  index?: number
}

const updateStream = (options: UpdateStreamOptions): void | Error => {
  const { doc, streamId, name, index } = options

  if (typeof index !== 'number' && typeof name !== 'string') {
    return new Error('Either index or name must be provided')
  }

  const streamMap = doc.getMap('stream')

  return Y.transact(doc as Y.Doc, (): void | Error => {
    const stream = streamMap.get(streamId)

    if (!stream) {
      return new Error(`Stream ${streamId} not found`)
    }

    if (typeof index === 'number') {
      stream.set('index', index)
    }

    if (typeof name === 'string') {
      stream.set('name', name)
    }

    stream.set('updatedAt', Date.now())
  })
}

export { updateStream }
