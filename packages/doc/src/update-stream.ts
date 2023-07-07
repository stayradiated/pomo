import * as Y from 'yjs'
import type { Doc } from './types.js'

type UpdateStreamOptions = {
  doc: Doc
  streamId: string
  name?: string
  index?: number
  parentId?: string | null
}

const updateStream = (options: UpdateStreamOptions): void | Error => {
  const { doc, streamId, name, index, parentId } = options

  if (
    typeof index !== 'number' &&
    typeof name !== 'string' &&
    typeof parentId !== 'string' &&
    parentId !== null
  ) {
    return new Error('Either index, name or parentId must be provided')
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

    if (typeof parentId === 'string' || parentId === null) {
      stream.set('parentId', parentId)
    }

    stream.set('updatedAt', Date.now())
  })
}

export { updateStream }
