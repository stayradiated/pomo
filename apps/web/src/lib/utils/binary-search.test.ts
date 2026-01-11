import { describe, expect, test } from 'vitest'

import { firstIndexGTE, lastIndexLTE } from './binary-search.js'

const I = <T>(x: T): T => x
const cmp = (a: number, b: number) => a - b

describe('lastIndexLTE', () => {
  test('returns undefined for empty list', () => {
    expect(lastIndexLTE([], 10, I, cmp)).toBeUndefined()
  })

  test('returns undefined when all elements are > target', () => {
    expect(lastIndexLTE([5, 6, 7], 4, I, cmp)).toBeUndefined()
  })

  test('returns last index when all elements are <= target', () => {
    expect(lastIndexLTE([1, 2, 3], 10, I, cmp)).toBe(2)
  })

  test('returns exact match index when target exists', () => {
    // last <= 2 is the element "2" at index 1
    expect(lastIndexLTE([1, 2, 3, 4], 2, I, cmp)).toBe(1)
  })

  test('returns the rightmost index <= target when target is between values', () => {
    // last <= 6 is 5 at index 2
    expect(lastIndexLTE([1, 3, 5, 7, 9], 6, I, cmp)).toBe(2)
  })

  test('handles duplicates: returns the last duplicate <= target', () => {
    // last <= 2 is the final 2 at index 3
    expect(lastIndexLTE([1, 2, 2, 2, 3], 2, I, cmp)).toBe(3)
  })

  test('handles duplicates when target falls between runs', () => {
    // last <= 2 is still index 2
    expect(lastIndexLTE([1, 1, 2, 3, 3], 2, I, cmp)).toBe(2)
  })
})

describe('firstIndexGTE', () => {
  test('returns undefined for empty list', () => {
    expect(firstIndexGTE([], 10, I, cmp)).toBeUndefined()
  })

  test('returns 0 when all elements are >= target', () => {
    expect(firstIndexGTE([5, 6, 7], 4, I, cmp)).toBe(0)
  })

  test('returns undefined when all elements are < target', () => {
    expect(firstIndexGTE([1, 2, 3], 10, I, cmp)).toBeUndefined()
  })

  test('returns exact match index when target exists', () => {
    // first >= 3 is 3 at index 2
    expect(firstIndexGTE([1, 2, 3, 4], 3, I, cmp)).toBe(2)
  })

  test('returns the leftmost index >= target when target is between values', () => {
    // first >= 6 is 7 at index 3
    expect(firstIndexGTE([1, 3, 5, 7, 9], 6, I, cmp)).toBe(3)
  })

  test('handles duplicates: returns the first duplicate >= target', () => {
    // first >= 2 is the first 2 at index 1
    expect(firstIndexGTE([1, 2, 2, 2, 3], 2, I, cmp)).toBe(1)
  })

  test('handles duplicates when target falls between runs', () => {
    // first >= 2 is index 2
    expect(firstIndexGTE([1, 1, 3, 3], 2, I, cmp)).toBe(2)
  })
})

/**
 * Optional: a couple tests using objects + key selector (proves generic behavior)
 */
describe('generic usage (objects + key)', () => {
  type Item = { startedAt: number }
  const key = (x: Item) => x.startedAt
  const items: Item[] = [
    { startedAt: 10 },
    { startedAt: 20 },
    { startedAt: 20 },
    { startedAt: 30 },
  ]

  test('firstIndexGTE with key selector', () => {
    expect(firstIndexGTE(items, 20, key, cmp)).toBe(1)
    expect(firstIndexGTE(items, 25, key, cmp)).toBe(3)
    expect(firstIndexGTE(items, 31, key, cmp)).toBeUndefined()
  })

  test('lastIndexLTE with key selector', () => {
    expect(lastIndexLTE(items, 20, key, cmp)).toBe(2)
    expect(lastIndexLTE(items, 25, key, cmp)).toBe(2)
    expect(lastIndexLTE(items, 9, key, cmp)).toBeUndefined()
  })
})
