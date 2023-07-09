import type { Doc } from './types.js'
import { upsertPoint } from './upsert-point.js'

type UpdateLabelStreamOptions = {
  doc: Doc
  streamId: string
  labelId: string
}

const updateLabelStream = (options: UpdateLabelStreamOptions): void | Error => {
  const { doc, streamId, labelId } = options

  if (!doc._transaction) {
    return new Error('Not in transaction')
  }

  const labelMap = doc.getMap('label')
  const label = labelMap.get(labelId)
  if (!label) {
    return new Error(`Label not found: ${labelId}`)
  }

  const streamMap = doc.getMap('stream')
  if (!streamMap.has(streamId)) {
    return new Error(`Stream not found: ${streamId}`)
  }

  const pointMap = doc.getMap('point')

  for (const point of pointMap.values()) {
    const labelIdList = point.get('labelIdList')!
    const index = labelIdList.toArray().indexOf(labelId)
    if (index < 0) {
      continue
    }

    labelIdList.delete(index)
    point.set('updatedAt', Date.now())

    const startedAt = point.get('startedAt')!

    upsertPoint({
      doc,
      streamId,
      startedAt,
      labelIdList: [labelId],
    })
  }

  label.set('streamId', streamId)
  label.set('updatedAt', Date.now())
}

export { updateLabelStream }
