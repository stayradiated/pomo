import type { Signal } from 'signia'
import { computed } from 'signia'

import type { StreamId } from '#lib/ids.js'
import type { Point } from '#lib/types.local.js'

import { firstIndexGTE, lastIndexLTE } from '#lib/utils/binary-search.js'
import { createSelector } from '#lib/utils/selector.js'

const getPointListForStream = createSelector(
  'getPointListForStream',
  (store, streamId: StreamId) => {
    const $filteredPointList = store.point.filter((value) => {
      return value.streamId === streamId
    })

    return computed('getPointListForStream', () => {
      return $filteredPointList.value.toSorted((a, b) => {
        return a.startedAt - b.startedAt
      })
    })
  },
)

const findIndexOfPoint = createSelector(
  'findIndexOfPoint',
  (
    store,
    streamId: StreamId,
    where: { startedAt: { lte: number } | { gte: number } },
  ): Signal<number | undefined> => {
    const $list = getPointListForStream(store, streamId)

    const getStartedAt = (point: Point) => point.startedAt
    const compare = (a: number, b: number) => a - b

    return computed('getLatestPointByStream', () => {
      if ('lte' in where.startedAt) {
        return lastIndexLTE(
          $list.value,
          where.startedAt.lte,
          getStartedAt,
          compare,
        )
      }
      return firstIndexGTE(
        $list.value,
        where.startedAt.gte,
        getStartedAt,
        compare,
      )
    })
  },
)

const getInclusivePointListForStream = createSelector(
  'getInclusivePointListForStream',
  (
    store,
    streamId: StreamId,
    where: {
      startedAt: { gte: number; lte?: number }
    },
  ): Signal<Point[]> => {
    const $pointList = getPointListForStream(store, streamId)
    const $startIndex = findIndexOfPoint(store, streamId, {
      startedAt: { lte: where.startedAt.gte },
    })

    const $endIndex =
      typeof where.startedAt.lte === 'number'
        ? findIndexOfPoint(store, streamId, {
            startedAt: { gte: where.startedAt.lte },
          })
        : undefined

    return computed('getInclusivePointListForStream', () => {
      const startIndex = $startIndex.value ?? 0
      const endIndex = $endIndex?.value
      return $pointList.value.slice(startIndex, endIndex)
    })
  },
)

const getPointAtTime = createSelector(
  'getPointAtTime',
  (store, streamId: StreamId, timestamp: number): Signal<Point | undefined> => {
    const $pointList = getPointListForStream(store, streamId)
    const $index = findIndexOfPoint(store, streamId, {
      startedAt: { lte: timestamp },
    })

    return computed('getPointAtTime', () => {
      const index = $index.value
      if (index === undefined) {
        return undefined
      }
      return $pointList.value[index]
    })
  },
)

const getAllPointsAtTime = createSelector(
  'getAllPointsAtTime',
  (store, timestamp: number): Signal<Record<StreamId, Point | undefined>> => {
    return computed('getAllPointsAtTime', () => {
      return Object.fromEntries(
        store.stream.keys.value.map((streamId) => {
          return [
            streamId,
            getPointAtTime(store, streamId, timestamp).value,
          ] as const
        }),
      )
    })
  },
)

export {
  getPointListForStream,
  findIndexOfPoint,
  getInclusivePointListForStream,
  getPointAtTime,
  getAllPointsAtTime,
}
