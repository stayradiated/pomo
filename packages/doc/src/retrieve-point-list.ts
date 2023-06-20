import type { Point } from '@stayradiated/pomo-core'
import type { AutomergeDoc } from './types.js'

type RetrieveOptions = {
  doc: AutomergeDoc
  since: number
  filter: {
    streamId?: string
  }
}

const retrievePointList = async (
  options: RetrieveOptions,
): Promise<Point[] | Error> => {
  const { doc, since, filter } = options

  const pointList = Object.values(doc.point).filter((point) => {
    if (point.startedAt < since) {
      return false
    }

    if (typeof filter.streamId === 'string') {
      return point.streamId === filter.streamId
    }

    return true
  })

  const streamIdList = Object.keys(doc.stream)

  const coveredStreamIdSet = new Set(pointList.map((point) => point.streamId))
  const uncoveredStreamIdSet = new Set(
    streamIdList.filter((streamId) => {
      return !coveredStreamIdSet.has(streamId)
    }),
  )

  if (uncoveredStreamIdSet.size === 0) {
    return pointList
  }

  const latestPointByStream: Record<string, Point> = {}

  for (const point of Object.values(doc.point)) {
    if (uncoveredStreamIdSet.has(point.streamId) && point.startedAt < since) {
      const latestPoint = latestPointByStream[point.streamId]
      if (!latestPoint || point.startedAt > latestPoint.startedAt) {
        latestPointByStream[point.streamId] = point
      }
    }
  }

  const bonusPoints = Object.values(latestPointByStream).flat()
  pointList.push(...bonusPoints)

  return pointList
}

export { retrievePointList }
