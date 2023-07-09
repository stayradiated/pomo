import type { Doc } from './types.js'

type DeleteLabelsOptions = {
  doc: Doc
  streamId: string
  labelIdList: string[]
}

const deleteLabels = (options: DeleteLabelsOptions): void | Error => {
  const { doc, streamId, labelIdList } = options

  if (!doc._transaction) {
    return new Error('Not in transaction')
  }

  const pointMap = doc.getMap('point')
  const labelMap = doc.getMap('label')

  // Validate that all labels exist and belong to the stream
  for (const labelId of labelIdList) {
    const label = labelMap.get(labelId)
    if (!label) {
      return new Error(`Label ${labelId} not found`)
    }

    const labelStreamId = label.get('streamId')
    if (labelStreamId !== streamId) {
      return new Error(`Label ${labelId} does not belong to stream ${streamId}`)
    }
  }

  for (const point of pointMap.values()) {
    if (point.get('streamId') !== streamId) {
      continue
    }

    const pointLabelIdList = point.get('labelIdList')
    if (!pointLabelIdList) {
      continue
    }

    for (const labelId of labelIdList) {
      const index = pointLabelIdList.toArray().indexOf(labelId)
      if (index >= 0) {
        pointLabelIdList.delete(index)
        point.set('updatedAt', Date.now())
      }
    }
  }

  for (const labelId of labelIdList) {
    labelMap.delete(labelId)
  }
}

export { deleteLabels }
