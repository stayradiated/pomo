import { expect, test } from 'vitest'

import { MinHeap } from './min-heap.js'

test('push', () => {
  const heap = new MinHeap<number>((a, b) => a < b)
  expect(heap.data).toEqual([])

  heap.push(10)
  expect(heap.data).toEqual([10])

  heap.push(3)
  expect(heap.data).toEqual([3, 10])

  heap.push(2)
  expect(heap.data).toEqual([2, 10, 3])

  heap.push(4)
  expect(heap.data).toEqual([2, 4, 3, 10])

  heap.push(5)
  expect(heap.data).toEqual([2, 4, 3, 10, 5])
})

test('pop', () => {
  const heap = new MinHeap<number>((a, b) => a < b)
  expect(heap.data).toEqual([])

  heap.push(13)
  heap.push(16)
  heap.push(31)
  heap.push(41)
  heap.push(51)
  heap.push(100)
  expect(heap.data).toEqual([13, 16, 31, 41, 51, 100])

  expect(heap.pop()).toBe(13)
  expect(heap.data).toEqual([16, 41, 31, 100, 51])

  expect(heap.pop()).toBe(16)
  expect(heap.data).toEqual([31, 41, 51, 100])

  expect(heap.pop()).toBe(31)
  expect(heap.data).toEqual([41, 100, 51])

  expect(heap.pop()).toBe(41)
  expect(heap.data).toEqual([51, 100])

  expect(heap.pop()).toBe(51)
  expect(heap.data).toEqual([100])

  expect(heap.pop()).toBe(100)
  expect(heap.data).toEqual([])

  expect(heap.pop()).toBe(undefined)
  expect(heap.data).toEqual([])
})
