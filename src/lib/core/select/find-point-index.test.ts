import { test as anyTest, describe } from 'vitest'

import type { PointId, StreamId } from '#lib/ids.js'

import { useNow } from '#lib/test/use-now.js'
import { useStore } from '#lib/test/use-store.js'

import { genId } from '#lib/utils/gen-id.js'

import { findPointIndex } from './find-point-index.js'

const test = anyTest.extend({
  now: useNow(),
  store: useStore(),
})

describe('where.startedAt.lte', () => {
  test('should return undefined for non-existant stream', async ({
    store,
    expect,
  }) => {
    const index = findPointIndex(store, 'foo' as StreamId, {
      startedAt: { lte: 0 },
    })
    expect(index.value).toBeUndefined()
  })

  test('should return undefined for empty stream', async ({
    store,
    expect,
  }) => {
    const streamId = genId<StreamId>()
    await store.mutate.stream_create({ streamId, name: 'Stream' })

    const index = findPointIndex(store, streamId, {
      startedAt: { lte: 0 },
    })
    expect(index.value).toBeUndefined()
  })

  test('should match exact startedAt', async ({ store, expect, now }) => {
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

    const index = findPointIndex(store, streamId, {
      startedAt: { lte: now },
    })
    expect(index.value).toBe(0)
  })

  test('should return undefined for points with startedAt > target', async ({
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
      startedAt: now + 1000,
    })

    const index = findPointIndex(store, streamId, {
      startedAt: { lte: now },
    })
    expect(index.value).toBeUndefined()
  })

  test('should return index of highest point with startedAt <= target', async ({
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

    const index = findPointIndex(store, streamId, {
      startedAt: { lte: now },
    })
    expect(index.value).toBe(0)
  })
})

describe('where.startedAt.gte', () => {
  test('should return undefined for non-existant stream', async ({
    store,
    expect,
  }) => {
    const index = findPointIndex(store, 'foo' as StreamId, {
      startedAt: { gte: 0 },
    })
    expect(index.value).toBeUndefined()
  })

  test('should return undefined for empty stream', async ({
    store,
    expect,
  }) => {
    const streamId = genId<StreamId>()
    await store.mutate.stream_create({ streamId, name: 'Stream' })

    const index = findPointIndex(store, streamId, {
      startedAt: { gte: 0 },
    })
    expect(index.value).toBeUndefined()
  })

  test('should match exact startedAt', async ({ store, expect, now }) => {
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

    const index = findPointIndex(store, streamId, {
      startedAt: { gte: now },
    })
    expect(index.value).toBe(0)
  })

  test('should return undefined for points with startedAt < target', async ({
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
      startedAt: now - 1000,
    })

    const index = findPointIndex(store, streamId, {
      startedAt: { gte: now },
    })
    expect(index.value).toBeUndefined()
  })

  test('should return index of lowest point with startedAt >= target', async ({
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

    const index = findPointIndex(store, streamId, {
      startedAt: { gte: now },
    })
    expect(index.value).toBe(1)
  })
})
