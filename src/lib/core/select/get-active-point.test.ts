import { test as anyTest } from 'vitest'

import type { PointId, StreamId } from '#lib/ids.js'

import { useNow } from '#lib/test/use-now.js'
import { useStore } from '#lib/test/use-store.js'

import { genId } from '#lib/utils/gen-id.js'

import { getActivePoint } from './get-active-point.js'

const test = anyTest.extend({
  now: useNow(),
  store: useStore(),
})

test('should return undefined for non-existant stream', async ({
  store,
  expect,
}) => {
  const index = getActivePoint(store, 'foo' as StreamId, 0)
  expect(index.value).toBeUndefined()
})

test('should return undefined for empty stream', async ({ store, expect }) => {
  const streamId = genId<StreamId>()
  await store.mutate.stream_create({ streamId, name: 'Stream' })

  const index = getActivePoint(store, streamId, 0)
  expect(index.value).toBeUndefined()
})

test('should return point when startedAt exactly matches', async ({
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

  const index = getActivePoint(store, streamId, now)
  expect(index.value?.id).toBe(pointId)
})

test('should return point when startedAt is within range', async ({
  store,
  expect,
  now,
}) => {
  const streamId = genId<StreamId>()
  await store.mutate.stream_create({ streamId, name: 'Stream' })

  const pointIdOld = genId<PointId>()
  await store.mutate.point_create({
    pointId: pointIdOld,
    streamId,
    labelIdList: [],
    description: 'Point',
    startedAt: now - 1000,
  })

  const pointIdNew = genId<PointId>()
  await store.mutate.point_create({
    pointId: pointIdNew,
    streamId,
    labelIdList: [],
    description: 'Point',
    startedAt: now + 1000,
  })

  const index = getActivePoint(store, streamId, now)
  expect(index.value?.id).toBe(pointIdOld)
})

test('should return undefined when startedAt is outside range', async ({
  store,
  expect,
  now,
}) => {
  const streamId = genId<StreamId>()
  await store.mutate.stream_create({ streamId, name: 'Stream' })

  const pointIdNew = genId<PointId>()
  await store.mutate.point_create({
    pointId: pointIdNew,
    streamId,
    labelIdList: [],
    description: 'Point',
    startedAt: now + 1000,
  })

  const index = getActivePoint(store, streamId, now)
  expect(index.value).toBeUndefined()
})
