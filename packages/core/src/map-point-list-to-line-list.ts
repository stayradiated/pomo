import { errorListBoundarySync } from '@stayradiated/error-boundary'
import type { Point } from '@stayradiated/pomo-doc'
import type { Line } from './types.js'
import { getNextPointInStream } from './get-next-point-in-stream.js'
import { mapPointsToLine } from './map-points-to-line.js'

// List must be pre-sorted by startedAt, but list may contain different streams
const mapPointListToLineList = (pointList: Point[]): Line[] | Error => {
  return errorListBoundarySync(() =>
    pointList.map((point) => {
      const stopPoint = getNextPointInStream(pointList, point)
      if (stopPoint instanceof Error) {
        return stopPoint
      }

      const line = mapPointsToLine(point, stopPoint)

      return line
    }),
  )
}

export { mapPointListToLineList }
