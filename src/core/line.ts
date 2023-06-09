import type { Selectable } from 'kysely'
import { parseISO } from 'date-fns'
import { errorListBoundarySync } from '@stayradiated/error-boundary'
import type { Point } from '#src/core/db.js'

type GetNextValueOptions = {
  id: number
  streamId: number
}

// List must be pre-sorted by startedAt, but list may contain different streams
const getNextValue = <T extends GetNextValueOptions>(
  list: T[],
  value: T,
): T | undefined | Error => {
  const filteredList = list.filter((item) => item.streamId === value.streamId)

  const index = filteredList.findIndex((item) => item.id === value.id)
  if (index === -1) {
    return new Error('Could not find value in list!')
  }

  const nextValue = filteredList[index + 1]
  if (!nextValue) {
    return undefined
  }

  return nextValue
}

type GetTimingsOptions = {
  startedAt: string
}

type Timings = {
  startedAt: Date
  stoppedAt: Date | undefined
  durationMs: number
}

const getTimings = <T extends GetTimingsOptions>(
  value: T,
  nextValue: T | undefined,
): Timings => {
  const startedAt = parseISO(value.startedAt)
  const stoppedAt = nextValue ? parseISO(nextValue.startedAt) : undefined
  const durationMs = stoppedAt
    ? stoppedAt.getTime() - startedAt.getTime()
    : Date.now() - startedAt.getTime()
  return { startedAt, stoppedAt, durationMs }
}

type Line = {
  id: number
  streamId: number
  value: string
  startedAt: Date
  stoppedAt: Date | undefined
  durationMs: number
}

type PointOptions = Pick<
  Selectable<Point>,
  'id' | 'streamId' | 'value' | 'startedAt'
>

// List must be pre-sorted by startedAt, but list may contain different streams
const mapPointListToLineList = (pointList: PointOptions[]): Line[] | Error => {
  return errorListBoundarySync(() =>
    pointList.map((point) => {
      const nextPoint = getNextValue(pointList, point)
      if (nextPoint instanceof Error) {
        return nextPoint
      }

      const { startedAt, stoppedAt, durationMs } = getTimings(point, nextPoint)

      const line: Line = {
        id: point.id,
        streamId: point.streamId,
        value: point.value,
        startedAt,
        stoppedAt,
        durationMs,
      }

      return line
    }),
  )
}

export { getNextValue, getTimings, mapPointListToLineList }
export type { Line }
