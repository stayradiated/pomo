import type { Doc } from './types.js'

type MergeLabelsOptions = {
  doc: Doc
  streamId: string
  srcLabelId: string
  destLabelId: string
}

const mergeLabels = (options: MergeLabelsOptions): undefined | Error => {
  const { doc, streamId, srcLabelId, destLabelId } = options

  if (!doc._transaction) {
    return new Error('Not in transaction')
  }

  if (srcLabelId === destLabelId) {
    return new Error('srcLabelId and destLabelId must be different')
  }

  const labelMap = doc.getMap('label')
  const pointMap = doc.getMap('point')

  const srcLabel = labelMap.get(srcLabelId)
  if (!srcLabel) {
    return new Error(`Label ${srcLabelId} not found`)
  }

  const destLabel = labelMap.get(destLabelId)
  if (!destLabel) {
    return new Error(`Label ${destLabelId} not found`)
  }

  if (srcLabel.get('streamId') !== streamId) {
    return new Error(
      `Label ${srcLabelId} does not belong to stream ${streamId}`,
    )
  }

  if (destLabel.get('streamId') !== streamId) {
    return new Error(
      `Label ${destLabelId} does not belong to stream ${streamId}`,
    )
  }

  for (const point of pointMap.values()) {
    if (point.get('streamId') !== streamId) {
      continue
    }

    const labelIdList = point.get('labelIdList')
    if (!labelIdList) {
      continue
    }

    const index = labelIdList.toArray().indexOf(srcLabelId)
    if (index >= 0) {
      labelIdList.delete(index)
      labelIdList.push([destLabelId])
      point.set('updatedAt', Date.now())
    }
  }

  labelMap.delete(srcLabelId)

  return
}

export { mergeLabels }
