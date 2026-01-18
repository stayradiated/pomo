import { test as anyTest } from 'vitest'

import type { PointId, StreamId } from '#lib/ids.js'

import { useNow } from '#lib/test/use-now.js'
import { useStore } from '#lib/test/use-store.js'

import { genId } from '#lib/utils/gen-id.js'

import { getActivePointRecord } from './get-active-point-record.js'

const test = anyTest.extend({
  now: useNow(),
  store: useStore(),
})

test('should return empty object when there are no streams', async ({
  store,
  expect,
}) => {
  const index = getActivePointRecord(store, 0)
  expect(index.value).toEqual({})
})

test('should return empty object when there are no points', async ({
  store,
  expect,
}) => {
  const streamId = genId<StreamId>()
  await store.mutate.stream_create({ streamId, name: 'Stream' })

  const index = getActivePointRecord(store, 0)
  expect(index.value).toEqual({})
})

test('should return object with one point when there is one point', async ({
  store,
  expect,
  now,
}) => {
  const streamId = genId<StreamId>()
  await store.mutate.stream_create({ streamId, name: 'Stream' })

  const pointId = genId<PointId>()
  await store.mutate.point_create({
    pointId,
    streamId,
    labelIdList: [],
    description: 'Point',
    startedAt: now,
  })

  const index = getActivePointRecord(store, now)
  expect(Object.keys(index.value)).toHaveLength(1)
  expect(index.value[streamId]?.id).toBe(pointId)
})

test('should return object with multiple points when there are multiple points', async ({
  store,
  expect,
  now,
}) => {
  const streamIdA = genId<StreamId>()
  const streamIdB = genId<StreamId>()
  const streamIdC = genId<StreamId>()
  await store.mutate.stream_create({ streamId: streamIdA, name: 'Stream A' })
  await store.mutate.stream_create({ streamId: streamIdB, name: 'Stream B' })
  await store.mutate.stream_create({ streamId: streamIdC, name: 'Stream C' })

  const pointIdA = genId<PointId>()
  await store.mutate.point_create({
    pointId: pointIdA,
    streamId: streamIdA,
    labelIdList: [],
    description: 'Point A',
    startedAt: now,
  })

  const pointIdB = genId<PointId>()
  await store.mutate.point_create({
    pointId: pointIdB,
    streamId: streamIdB,
    labelIdList: [],
    description: 'Point B',
    startedAt: now - 1000,
  })

  const pointIdC = genId<PointId>()
  await store.mutate.point_create({
    pointId: pointIdC,
    streamId: streamIdC,
    labelIdList: [],
    description: 'Point C',
    startedAt: now + 1000,
  })

  const index = getActivePointRecord(store, now)
  expect(Object.keys(index.value)).toHaveLength(2)
  expect(index.value[streamIdA]?.id).toBe(pointIdA)
  expect(index.value[streamIdB]?.id).toBe(pointIdB)
})
