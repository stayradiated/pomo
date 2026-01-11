import type { Signal } from 'signia'
import { computed } from 'signia'

import { createSelector } from '#lib/utils/selector.js'

const getTimeZone = createSelector('getTimeZone', (store): Signal<string> => {
  const user = store.user.get(store.sessionUserId)
  return computed('getTimeZone', () => {
    return user.value ? user.value.timeZone : 'UTC'
  })
})

export { getTimeZone }
