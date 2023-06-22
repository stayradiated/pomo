import { randomUUID } from 'node:crypto'
import Automerge from '@automerge/automerge'
import type { AutomergeDoc } from './types.js'

type UpsertStreamOptions = {
  doc: AutomergeDoc
  name: string
}

const upsertStream = (options: UpsertStreamOptions): AutomergeDoc => {
  const { doc: srcDoc, name } = options

  return Automerge.change(srcDoc, 'upsertStream', (doc) => {
    const existingStream = Object.values(doc.stream).find((stream) => {
      return stream.name === name
    })

    if (existingStream) {
      existingStream.name = name
      existingStream.updatedAt = Date.now()
      return
    }

    const id = randomUUID()
    doc.stream[id] = {
      id,
      name,
      createdAt: Date.now(),
      updatedAt: null,
    }
  })
}

export { upsertStream }
