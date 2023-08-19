import * as Y from 'yjs'
import { randomUlid } from './utils/ulid.js'
import { find } from './utils/find.js'
import type { Doc, YLabel } from './types.js'

type UpsertLabelOptions = {
  doc: Doc
  name: string
  streamId: string
  icon?: string | null
  color?: string | null
  parentId?: string | null
}

const upsertLabel = (options: UpsertLabelOptions): string | Error => {
  const { doc, name, icon, streamId, color, parentId } = options

  if (!doc._transaction) {
    return new Error('Not in transaction')
  }

  const labelMap = doc.getMap('label')

  const existingLabel = find(
    labelMap.values(),
    (label: YLabel) =>
      label.get('name') === name && label.get('streamId') === streamId,
  )

  if (existingLabel) {
    let hasChanged = false

    if (typeof icon === 'string' || icon === null) {
      existingLabel.set('icon', icon)
      hasChanged = true
    }

    if (typeof color === 'string' || color === null) {
      existingLabel.set('color', color)
      hasChanged = true
    }

    if (typeof parentId === 'string' || parentId === null) {
      existingLabel.set('parentId', parentId)
      hasChanged = true
    }

    if (hasChanged) {
      existingLabel.set('updatedAt', Date.now())
    }

    return existingLabel.get('id')!
  }

  const labelId = randomUlid()
  const label = new Y.Map() as YLabel
  label.set('id', labelId)
  label.set('streamId', streamId)
  label.set('name', name)
  label.set('icon', icon ?? null)
  label.set('color', color ?? null)
  label.set('parentId', parentId ?? null)
  label.set('createdAt', Date.now())
  label.set('updatedAt', null)
  labelMap.set(labelId, label)
  return labelId
}

export { upsertLabel }
