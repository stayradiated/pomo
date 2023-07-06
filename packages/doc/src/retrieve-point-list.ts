import type { Doc, Point } from './types.js'

type RetrieveOptions = {
  doc: Doc
  startDate: number
  endDate: number
  where: {
    streamIdList?: string[]
  }
}

const retrievePointList = (options: RetrieveOptions): Point[] => {
  const { doc, startDate, endDate, where } = options

  const pointMap = doc.getMap('point')
  const streamMap = doc.getMap('stream')

  const pointList = [...pointMap.values()]
    .filter((point) => {
      const pointStartedAt = point.get('startedAt')!
      if (pointStartedAt < startDate || pointStartedAt > endDate) {
        return false
      }

      if (where.streamIdList) {
        return where.streamIdList.includes(point.get('streamId')!)
      }

      return true
    })
    .map((point) => {
      return point.toJSON() as Point
    })

  const latestPointByStream: Record<string, Point> = {}

  const streamIdSet = where.streamIdList
    ? new Set(where.streamIdList)
    : new Set(streamMap.keys())

  for (const point of pointMap.values()) {
    const pointStreamId = point.get('streamId')!
    const pointStartedAt = point.get('startedAt')!

    if (streamIdSet.has(pointStreamId) && pointStartedAt < startDate) {
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
