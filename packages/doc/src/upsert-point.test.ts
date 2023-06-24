import { describe, test, expect } from 'vitest'
import { upsertPoint } from './upsert-point.js'
import { createDoc } from './create-doc.js'

describe('upsertPoint', () => {
  test('insert new point', () => {
    const doc = createDoc()

    const pointId = upsertPoint({
      doc,
      streamId: 'streamId',
      startedAt: 1,
      value: 'test',
    })

    const pointMap = doc.getMap('point')

    expect(pointMap.toJSON()).toStrictEqual({
      [pointId]: {
        id: pointId,
        streamId: 'streamId',
        startedAt: 1,
        value: 'test',
        labelIdList: [],
        createdAt: expect.any(Number),
        updatedAt: null,
      },
    })
  })

  test('update existing point', () => {
    const doc = createDoc()

    const pointIdA = upsertPoint({
      doc,
      streamId: 'streamId',
      startedAt: 1,
      value: 'test',
    })
    const pointIdB = upsertPoint({
      doc,
      streamId: 'streamId',
      startedAt: 1,
      value: 'test2',
    })

    expect(pointIdA).toBe(pointIdB)

    const pointMap = doc.getMap('point')

    expect(pointMap.toJSON()).toStrictEqual({
      [pointIdA]: {
        id: pointIdA,
        streamId: 'streamId',
        startedAt: 1,
        value: 'test2',
        labelIdList: [],
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
    })
  })
})
