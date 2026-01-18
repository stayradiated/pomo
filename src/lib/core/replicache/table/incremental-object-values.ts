import type { AtomOptions, Signal } from 'signia'
import { computed } from 'signia'

import type { DiffList } from './diff.js'

const incrementalObjectValues = <Value>(
  source: Signal<Record<string, Value>, DiffList<Value>>,
  options?: AtomOptions<Value[], never>,
): Signal<Value[], never> => {
  return computed(
    `${source.name}:values`,
    () => {
      return Object.values(source.value)
    },
    {
      ...options,
    },
  )
}

export { incrementalObjectValues }
