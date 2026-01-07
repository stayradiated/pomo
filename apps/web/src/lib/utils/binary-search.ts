// A total-order comparator: <0 if a<b, 0 if equal, >0 if a>b
type Comparator<K> = (a: K, b: K) => number

// Returns true if key(item) is valid, false otherwise.
type Predicate<K> = (a: K, b: K) => boolean

// Find an upper / lower bound
// Returns first index i in [0, n] such that:
//   compare(key(arr[i]), target) == true
// Returns n if no such element exists.
const binarySearch = <ListItem, Prop>(
  list: readonly ListItem[],
  target: Prop,
  key: (item: ListItem) => Prop,
  compare: Predicate<Prop>,
): number => {
  let lo = 0
  let hi = list.length

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1)
    // biome-ignore lint/style/noNonNullAssertion: this is a valid index
    const midValue = list[mid]!
    const isValid = compare(key(midValue), target)
    if (isValid) {
      hi = mid
    } else {
      lo = mid + 1
    }
  }

  return lo
}

// Rightmost index where key(item) <= target (or undefined if none).
const lastIndexLTE = <ListItem, Prop>(
  list: readonly ListItem[],
  target: Prop,
  key: (item: ListItem) => Prop,
  compare: Comparator<Prop>,
): number | undefined => {
  const i =
    binarySearch(list, target, key, (a, b) => {
      return compare(a, b) > 0
    }) - 1
  return i >= 0 ? i : undefined
}

// Leftmost index where key(item) >= target (or undefined if none).
const firstIndexGTE = <ListItem, Prop>(
  list: readonly ListItem[],
  target: Prop,
  key: (item: ListItem) => Prop,
  compare: Comparator<Prop>,
) => {
  const i = binarySearch(list, target, key, (a, b) => {
    return compare(a, b) >= 0
  })
  return i < list.length ? i : undefined
}

export { lastIndexLTE, firstIndexGTE }
