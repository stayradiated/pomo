// this implementation of `once` uses using the `globalThis` object to persist
// the state between hot reloads.
const onceGlobal = <K extends string | symbol, T>(
  key: K,
  fn: () => T,
): (() => T) => {
  return () => {
    const global = globalThis as unknown as Record<K, T>
    if (key in global) {
      return global[key]
    }
    const value = fn()
    global[key] = value
    return value
  }
}

export { onceGlobal }
