import type { Doc } from './types.js'

type UpdateLabelOptions = {
  doc: Doc
  labelId: string
  name?: string
  icon?: string | null
  color?: string | null
  parentId?: string | null
}

const updateLabel = (options: UpdateLabelOptions): undefined | Error => {
  const { doc, labelId, name, color, icon, parentId } = options

  if (!doc._transaction) {
    return new Error('Not in transaction')
  }

  if (
    typeof name !== 'string' &&
    typeof color !== 'string' &&
    color !== null &&
    typeof parentId !== 'string' &&
    parentId !== null &&
    typeof icon !== 'string' &&
    icon !== null
  ) {
    return new Error('Either name, color, icon or parentId must be provided')
  }

  const labelMap = doc.getMap('label')

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

  if (typeof icon === 'string' || icon === null) {
    label.set('icon', icon)
  }

  if (typeof parentId === 'string' || parentId === null) {
    label.set('parentId', parentId)
  }

  label.set('updatedAt', Date.now())

  return
}

export { updateLabel }
