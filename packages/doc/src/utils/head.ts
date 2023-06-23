const head = <T>(iterator: IterableIterator<T>): T | undefined => {
  return iterator.next().value
}

export { head }
