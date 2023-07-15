import { $JsonDoc } from './schema.js'
import type { Doc } from './types.js'

type ValidateOptions = {
  doc: Doc
}

const validate = (options: ValidateOptions): void | Error => {
  const { doc } = options

  const result = $JsonDoc.safeParse({
    label: doc.getMap('label').toJSON(),
    point: doc.getMap('point').toJSON(),
    stream: doc.getMap('stream').toJSON(),
    user: doc.getMap('user').toJSON(),
  })

  if (!result.success) {
    return result.error
  }

  const pointMap = doc.getMap('point')
  const labelMap = doc.getMap('label')
  const streamMap = doc.getMap('stream')

  const streamPointStartedAtSetMap = new Map<string, Set<number>>()

  for (const [pointId, point] of pointMap.entries()) {
    if (pointId !== point.get('id')) {
      return new Error(`Point ${pointId} has mismatched id ${point.get('id')}`)
    }

    // Unique(Point.startedAt, Point.streamId)
    const streamId = point.get('streamId')!
    const startedAt = point.get('startedAt')!
    const streamPointStartedAtSet = streamPointStartedAtSetMap.get(streamId)
    if (streamPointStartedAtSet) {
      if (streamPointStartedAtSet.has(startedAt)) {
        return new Error(
          `Point ${pointId} has duplicate startedAt ${startedAt} in stream ${streamId}`,
        )
      }

      streamPointStartedAtSet.add(startedAt)
    } else {
      streamPointStartedAtSetMap.set(streamId, new Set([startedAt]))
    }

    // Point.streamId → stream.id
    if (!streamMap.has(streamId)) {
      return new Error(
        `Point ${pointId} references non-existent stream ${streamId}`,
      )
    }

    // Point.labelIdList → label.id
    const labelIdList = point.get('labelIdList')!
    for (const labelId of labelIdList) {
      if (!labelMap.has(labelId)) {
        return new Error(
          `Point ${pointId} references non-existent label ${labelId}`,
        )
      }
    }
  }

  for (const [labelId, label] of labelMap.entries()) {
    if (labelId !== label.get('id')) {
      return new Error(`Label ${labelId} has mismatched id ${label.get('id')}`)
    }

    // Label.streamId → stream.id
    const streamId = label.get('streamId')!
    if (!streamMap.has(streamId)) {
      return new Error(
        `Label ${labelId} references non-existent stream ${streamId}`,
      )
    }
  }

  for (const [streamId, stream] of streamMap.entries()) {
    if (streamId !== stream.get('id')) {
      return new Error(
        `Stream ${streamId} has mismatched id ${stream.get('id')}`,
      )
    }
  }

  return undefined
}

export { validate }
