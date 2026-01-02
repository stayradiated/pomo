// this implementation of `once` intentionally does not support receiving
// arguments, as that increases the risk of misuse. If you need to pass
// arguments to the function, you should use `memoize` instead.
const once = <T>(fn: () => T): (() => T) => {
  let called = false
  let value: T
  return () => {
    if (called) {
      return value
    }
    value = fn()
    called = true
    return value
  }
}

export { once }
