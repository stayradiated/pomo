import type { Signal } from 'signia'
import { computed } from 'signia'

import type { StreamId } from '#lib/ids.js'
import type { Point } from '#lib/types.local.js'

import { createSelector } from '#lib/utils/selector.js'

import { getActivePoint } from './get-active-point.js'

const getActivePointRecord = createSelector(
  'getAllPointsAtTime',
  (store, timestamp: number): Signal<Record<StreamId, Point>> => {
    return computed('getActivePointRecord', () => {
      return Object.fromEntries(
        store.stream.keys.value.flatMap<[StreamId, Point]>((streamId) => {
          const point = getActivePoint(store, streamId, timestamp).value
          if (!point) {
            return [] as never[]
          }
          return [[streamId, point]]
        }),
      )
    })
  },
)

export { getActivePointRecord }
