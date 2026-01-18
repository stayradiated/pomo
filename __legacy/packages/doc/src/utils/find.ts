const find = <T>(
  iterator: IterableIterator<T>,
  predicate: (item: T) => boolean,
): T | undefined => {
  for (const item of iterator) {
    if (predicate(item)) {
      return item
    }
  }

  return undefined
}

export { find }
