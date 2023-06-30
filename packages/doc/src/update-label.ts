import * as Y from 'yjs'
import type { Doc } from './types.js'

type UpdateLabelOptions = {
  doc: Doc
  labelId: string
  name: string
}

const updateLabel = (options: UpdateLabelOptions): void | Error => {
  const { doc, labelId, name } = options

  const labelMap = doc.getMap('label')

  return Y.transact(doc as Y.Doc, (): void | Error => {
    const label = labelMap.get(labelId)

    if (!label) {
      return new Error(`Label ${labelId} not found`)
    }

    if (typeof name === 'string') {
      label.set('name', name)
    }

    label.set('updatedAt', Date.now())
  })
}

export { updateLabel }
