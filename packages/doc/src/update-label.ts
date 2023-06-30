import * as Y from 'yjs'
import type { Doc } from './types.js'

type UpdateLabelOptions = {
  doc: Doc
  labelId: string
  name?: string
  color?: string | undefined
}

const updateLabel = (options: UpdateLabelOptions): void | Error => {
  const { doc, labelId, name, color } = options

  if (typeof name !== 'string' && typeof color !== 'string' && color !== null) {
    return new Error('Either name or color must be provided')
  }

  const labelMap = doc.getMap('label')

  return Y.transact(doc as Y.Doc, (): void | Error => {
    const label = labelMap.get(labelId)

    if (!label) {
      return new Error(`Label ${labelId} not found`)
    }

    if (typeof name === 'string') {
      label.set('name', name)
    }

    if (typeof color === 'string' || color === null) {
      label.set('color', color)
    }

    label.set('updatedAt', Date.now())
  })
}

export { updateLabel }
