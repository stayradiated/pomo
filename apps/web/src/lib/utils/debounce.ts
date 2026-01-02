const createDebounce = <Args extends unknown[]>(
  timeoutMs: number,
  func: (...args: Args) => unknown,
) => {
  if (timeoutMs <= 0) {
    return func
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: Args) => {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), timeoutMs)
  }
}

export { createDebounce }
