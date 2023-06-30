import { randomUUID } from 'node:crypto'
import * as Y from 'yjs'
import { find } from './utils/find.js'
import type { Doc, YLabel } from './types.js'

type UpsertLabelOptions = {
  doc: Doc
  name: string
  streamId: string
  color?: string | undefined
}

const upsertLabel = (options: UpsertLabelOptions): string => {
  const { doc, name, streamId, color } = options

  const labelMap = doc.getMap('label')

  const existingLabel = find(
    labelMap.values(),
    (label: YLabel) =>
      label.get('name') === name && label.get('streamId') === streamId,
  )

  return Y.transact<string>(doc as Y.Doc, () => {
    if (existingLabel) {
      if (color !== undefined) {
        existingLabel.set('name', name)
        existingLabel.set('updatedAt', Date.now())
      }

      return existingLabel.get('id')!
    }

    const labelId = randomUUID()
    const label = new Y.Map() as YLabel
    label.set('id', labelId)
    label.set('streamId', streamId)
    label.set('name', name)
    label.set('color', color ?? null)
    label.set('createdAt', Date.now())
    label.set('updatedAt', null)
    labelMap.set(labelId, label)
    return labelId
  })
}

export { upsertLabel }
