import type { Signal } from 'signia'
import { computed } from 'signia'

import type { StreamId } from '#lib/ids.js'
import type { Point } from '#lib/types.local.js'
import type { Line } from './types.js'

import { clock } from '#lib/utils/clock.js'
import { createSelector } from '#lib/utils/selector.js'

import { getInclusivePointListForStream } from './point.js'

type BuildLineOptions<PointLike extends Point> = {
  points: [PointLike, PointLike | undefined]
  now?: number
}

const buildLine = <PointLike extends Point>(
  options: BuildLineOptions<PointLike>,
): Line => {
  const { points, now = Date.now() } = options
  const [startPoint, stopPoint] = points
  if (stopPoint) {
    if (startPoint.streamId !== stopPoint.streamId) {
      throw new Error('Stream IDs must match')
    }
    if (stopPoint.startedAt < startPoint.startedAt) {
      throw new Error('Stop Point must be after Start Point')
    }
  }

  const startedAt = startPoint.startedAt
  const stoppedAt = stopPoint ? stopPoint.startedAt : undefined
  const durationMs = stoppedAt ? stoppedAt - startedAt : now - startedAt

  const line: Line = {
    id: startPoint.id,
    streamId: startPoint.streamId,
    description: startPoint.description,
    labelIdList: startPoint.labelIdList,
    startedAt,
    stoppedAt,
    durationMs,
    createdAt: Math.max(startPoint.createdAt, stopPoint?.createdAt ?? 0),
    updatedAt: Math.max(startPoint.updatedAt, stopPoint?.updatedAt ?? 0),
  }

  return line
}

const getLineListForStream = createSelector(
  'getLineListForStream',
  (
    store,
    streamId: StreamId,
    where: {
      startedAt: { gte: number; lte?: number }
    },
  ): Signal<Line[]> => {
    const $pointList = getInclusivePointListForStream(store, streamId, where)

    return computed('getLineListForStream', () => {
      const pointList = $pointList.value
      return pointList.map((point, index, list) => {
        const nextPoint = list[index + 1]
        return buildLine({
          points: [point, nextPoint],
          now: clock.value,
        })
      })
    })
  },
)

const getAllLineLists = createSelector(
  'getAllLineLists',
  (
    store,
    where: {
      startedAt: { gte: number; lte?: number }
    },
  ): Signal<Record<StreamId, Line[]>> => {
    return computed('getAllLineLists', () => {
      return Object.fromEntries(
        store.stream.keys.value.map((streamId) => {
          return [
            streamId,
            getLineListForStream(store, streamId, where).value,
          ] as const
        }),
      )
    })
  },
)

export { buildLine, getLineListForStream, getAllLineLists }
