import type { Doc, Point } from './types.js'

const reducePointListToStreamIdSet = (pointList: Point[]): Set<string> => {
  return pointList.reduce((set, point) => {
    set.add(point.streamId)
    return set
  }, new Set<string>())
}

type RetrieveOptions = {
  doc: Doc
  since: number
  where: {
    streamId?: string
  }
}

const retrievePointList = (options: RetrieveOptions): Point[] => {
  const { doc, since, where } = options

  const pointMap = doc.getMap('point')
  const streamMap = doc.getMap('stream')

  const streamIdList =
    typeof where.streamId === 'string'
      ? [where.streamId]
      : [...streamMap.keys()]

  const pointList = [...pointMap.values()]
    .filter((point) => {
      if (point.get('startedAt')! < since) {
        return false
      }

      if (typeof where.streamId === 'string') {
        return point.get('streamId') === where.streamId
      }

      return true
    })
    .map((point) => {
      return point.toJSON() as Point
    })

  const coveredStreamIdSet = reducePointListToStreamIdSet(pointList)
  const uncoveredStreamIdSet = new Set(
    streamIdList.filter((streamId) => {
      return !coveredStreamIdSet.has(streamId)
    }),
  )

  if (uncoveredStreamIdSet.size === 0) {
    return pointList
  }

  const latestPointByStream: Record<string, Point> = {}

  for (const point of pointMap.values()) {
    const pointStreamId = point.get('streamId')!
    const pointStartedAt = point.get('startedAt')!

    if (uncoveredStreamIdSet.has(pointStreamId) && pointStartedAt < since) {
      const latestPoint = latestPointByStream[pointStreamId]
      if (!latestPoint || pointStartedAt > latestPoint.startedAt) {
        latestPointByStream[pointStreamId] = point.toJSON() as Point
      }
    }
  }

  const bonusPoints = Object.values(latestPointByStream).flat()
  pointList.push(...bonusPoints)

  // Sort by startedAt ascending
  pointList.sort((a, b) => a.startedAt - b.startedAt)

  return pointList
}

export { retrievePointList }
