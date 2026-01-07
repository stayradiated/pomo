import type { Signal } from 'signia'
import { computed } from 'signia'

import type { StreamId } from '#lib/ids.js'
import type { Point } from '#lib/types.local.js'

import { memoizeWithStore } from '#lib/core/replicache/store.js'

const getPointListForStream = memoizeWithStore(
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

const findIndexOfPoint = memoizeWithStore(
  'findIndexOfPoint',
  (
    store,
    streamId: StreamId,
    where: { startedAt: { lt: number } | { gt: number } },
  ): Signal<number | undefined> => {
    const $list = getPointListForStream(store, streamId)

    return computed('getLatestPointByStream', () => {
      /* binary search */

      // return binarySearch($pointList.value, (point) => {
      //   return point.startedAt - where.startedAt.lt
      // })

      const list = $list.value
      const length = list.length
      if (length === 0) {
        return undefined
      }

      let lower = 0
      let upper = length
      while (true) {
        if (upper === lower) {
          return lower
        }

        const i = Math.floor((upper - lower) / 2)
        const value = list[i]
        if (!value) {
          return undefined
        }

        if (
          'lt' in where.startedAt
            ? value.startedAt >= where.startedAt.lt
            : value.startedAt <= where.startedAt.gt
        ) {
          upper = i
        } else {
          lower = i
        }
      }
    })
  },
)

const getInclusivePointListForStream = memoizeWithStore(
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
      startedAt: { lt: where.startedAt.gte },
    })

    const $endIndex =
      typeof where.startedAt.lte === 'number'
        ? findIndexOfPoint(store, streamId, {
            startedAt: { gt: where.startedAt.lte },
          })
        : undefined

    return computed('getInclusivePointListForStream', () => {
      const startIndex = $startIndex.value ?? 0
      const endIndex = $endIndex?.value
      return $pointList.value.slice(startIndex, endIndex)
    })
  },
)

const getPointAtTime = memoizeWithStore(
  'getPointAtTime',
  (store, streamId: StreamId, timestamp: number): Signal<Point | undefined> => {
    const $pointList = getPointListForStream(store, streamId)
    const $index = findIndexOfPoint(store, streamId, {
      startedAt: { lt: timestamp },
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

const getAllPointsAtTime = memoizeWithStore(
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
