import type { Signal } from 'signia'
import { computed } from 'signia'

import type { StreamId } from '#lib/ids.js'
import type { Point } from '#lib/types.local.js'

import { createSelector } from '#lib/utils/selector.js'

import { findPointIndex } from './find-point-index.js'
import { getPointList } from './get-point-list.js'

const getActivePoint = createSelector(
  'getActivePoint',
  (store, streamId: StreamId, timestamp: number): Signal<Point | undefined> => {
    const $pointList = getPointList(store, streamId)
    const $index = findPointIndex(store, streamId, {
      startedAt: { lte: timestamp },
    })

    return computed('getActivePoint', () => {
      const index = $index.value
      if (typeof index === 'undefined') {
        return undefined
      }
      return $pointList.value[index]
    })
  },
)

export { getActivePoint }
