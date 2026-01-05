import type { Signal } from 'signia'
import { computed } from 'signia'

import { memoizeWithStore } from '#lib/core/replicache/store.js'

const getTimeZone = memoizeWithStore('getTimeZone', (store): Signal<string> => {
  const user = store.user.get(store.sessionUserId)
  return computed('getTimeZone', () => {
    return user.value ? user.value.timeZone : 'UTC'
  })
})

export { getTimeZone }
