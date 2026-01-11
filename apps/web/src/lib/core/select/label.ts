import { computed } from 'signia'

import type { StreamId } from '#lib/ids.js'

import { createSelector } from '#lib/utils/selector.js'

const getLabelListForStream = createSelector(
  'getLabelListForStream',
  (store, streamId: StreamId) => {
    const $filteredLabelList = store.label.filter((value) => {
      return value.streamId === streamId
    })

    return computed('getLabelListForStream', () => {
      return $filteredLabelList.value.toSorted((a, b) => {
        return a.name.localeCompare(b.name)
      })
    })
  },
)

export { getLabelListForStream }
