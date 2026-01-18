import { test as anyTest, describe } from 'vitest'

import type { PointId, StreamId } from '#lib/ids.js'

import { useNow } from '#lib/test/use-now.js'
import { useStore } from '#lib/test/use-store.js'

import { genId } from '#lib/utils/gen-id.js'

import { getActivePointList } from './get-active-point-list.js'

const test = anyTest.extend({
  now: useNow(),
  store: useStore(),
})

describe('where.startedAt.lte', () => {
  test('should return empty list for non-existant stream', async ({
    store,
    expect,
  }) => {
    const index = getActivePointList(store, 'foo' as StreamId, {
      startedAt: { lte: 0 },
    })
    expect(index.value).toHaveLength(0)
  })

  test('should return empty list for empty stream', async ({
    store,
    expect,
  }) => {
    const streamId = genId<StreamId>()
    await store.mutate.stream_create({ streamId, name: 'Stream' })

    const index = getActivePointList(store, streamId, {
      startedAt: { lte: 0 },
    })
    expect(index.value).toHaveLength(0)
  })

  test('should return entire list for existing stream', async ({
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

    const index = getActivePointList(store, streamId, {
      startedAt: { lte: now },
    })
    expect(index.value.length).toBe(1)
    expect(index.value[0]?.id).toBe(pointId)
  })

  test('should return section of list for existing stream', async ({
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

    const index = getActivePointList(store, streamId, {
      startedAt: { lte: now },
    })
    expect(index.value.length).toBe(2)
    expect(index.value[0]?.id).toBe(pointIdOld)
    expect(index.value[1]?.id).toBe(pointIdMid)
  })
})

describe('where.startedAt.gte', () => {
  test('should return empty list for non-existant stream', async ({
    store,
    expect,
  }) => {
    const index = getActivePointList(store, 'foo' as StreamId, {
      startedAt: { gte: 0 },
    })
    expect(index.value).toHaveLength(0)
  })

  test('should return empty list for empty stream', async ({
    store,
    expect,
  }) => {
    const streamId = genId<StreamId>()
    await store.mutate.stream_create({ streamId, name: 'Stream' })

    const index = getActivePointList(store, streamId, {
      startedAt: { gte: 0 },
    })
    expect(index.value).toHaveLength(0)
  })

  test('should return entire list for existing stream', async ({
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

    const index = getActivePointList(store, streamId, {
      startedAt: { gte: now },
    })
    expect(index.value.length).toBe(1)
    expect(index.value[0]?.id).toBe(pointId)
  })

  test('should return section of list for existing stream', async ({
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

    const index = getActivePointList(store, streamId, {
      startedAt: { gte: now },
    })
    expect(index.value.length).toBe(2)
    expect(index.value[0]?.id).toBe(pointIdMid)
    expect(index.value[1]?.id).toBe(pointIdNew)
  })
})

describe('where.startedAt.lte + where.startedAt.gte', () => {
  test('should return entire list for existing stream', async ({
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

    const index = getActivePointList(store, streamId, {
      startedAt: { lte: now, gte: now },
    })
    expect(index.value.length).toBe(1)
    expect(index.value[0]?.id).toBe(pointId)
  })

  test('should return section of list for existing stream', async ({
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

    const index = getActivePointList(store, streamId, {
      startedAt: { lte: now - 500, gte: now + 500 },
    })
    expect(index.value.length).toBe(1)
    expect(index.value[0]?.id).toBe(pointIdMid)
  })
})
