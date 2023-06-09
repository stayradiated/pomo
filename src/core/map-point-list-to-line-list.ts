import type { Selectable } from 'kysely'
import { errorListBoundarySync } from '@stayradiated/error-boundary'
import type { Point } from '#src/core/db.js'
import { getNextPointInStream } from '#src/core/get-next-point-in-stream.js'
import { mapPointsToLine } from '#src/core/map-points-to-line.js'
import type { Line } from '#src/core/line.js'

type PointOptions = Pick<
  Selectable<Point>,
  'id' | 'streamId' | 'value' | 'startedAt'
>

// List must be pre-sorted by startedAt, but list may contain different streams
const mapPointListToLineList = (pointList: PointOptions[]): Line[] | Error => {
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
