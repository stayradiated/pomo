import type { Point } from '@stayradiated/pomo-doc'
import { getNextPointInStream } from './get-next-point-in-stream.js'
import { mapPointsToLine } from './map-points-to-line.js'
import type { Line } from './types.js'

const mapPointListToLineList = (pointList: Point[]): Line[] | Error => {
  let previousStartedAt = 0

  const lineList: Line[] = []
  for (const point of pointList) {
    if (point.startedAt < previousStartedAt) {
      return new Error('Points are not in order')
    }

    previousStartedAt = point.startedAt

    const stopPoint = getNextPointInStream(pointList, point)
    if (stopPoint instanceof Error) {
      return stopPoint
    }

    const line = mapPointsToLine(point, stopPoint)
    if (line instanceof Error) {
      return line
    }

    lineList.push(line)
  }

  return lineList
}

export { mapPointListToLineList }
