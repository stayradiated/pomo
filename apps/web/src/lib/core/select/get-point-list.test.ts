import { test as anyTest } from 'vitest'

import type { PointId, StreamId } from '#lib/ids.js'

import { useNow } from '#lib/test/use-now.js'
import { useStore } from '#lib/test/use-store.js'

import { genId } from '#lib/utils/gen-id.js'

import { getPointList } from './get-point-list.js'

const test = anyTest.extend({
  now: useNow(),
  store: useStore(),
})

test('should return empty list for non-existant stream', async ({
  store,
  expect,
}) => {
  const pointList = getPointList(store, 'foo' as StreamId)
  expect(pointList.value).toEqual([])
})

test('should return empty list for empty stream', async ({ store, expect }) => {
  const streamId = genId<StreamId>()
  await store.mutate.stream_create({ streamId, name: 'Stream' })

  const pointList = getPointList(store, streamId)
  expect(pointList.value).toEqual([])
})

test('should return list of points for existing stream', async ({
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

  const pointList = getPointList(store, streamId)
  expect(pointList.value.length).toBe(1)
  expect(pointList.value[0]?.id).toBe(pointId)
})

test('should not include points from other streams', async ({
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

  const pointList = getPointList(store, 'foo' as StreamId)
  expect(pointList.value.length).toBe(0)
})

test('should sort points by startedAt (ascending)', async ({
  store,
  expect,
  now,
}) => {
  const streamId = genId<StreamId>()
  await store.mutate.stream_create({ streamId, name: 'Stream' })

  const pointIdMid = genId<PointId>()
  await store.mutate.point_create({
    pointId: pointIdMid,
    streamId,
    labelIdList: [],
    description: 'Point',
    startedAt: now,
  })

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

  const pointList = getPointList(store, streamId)
  expect(pointList.value.length).toBe(3)

  const pointIdList = pointList.value.map((point) => point.id)
  expect(pointIdList).toEqual([pointIdOld, pointIdMid, pointIdNew])
})
