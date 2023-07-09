import { describe, test, expect } from 'vitest'
import { assertOk } from '@stayradiated/error-boundary'
import { upsertPoint } from './upsert-point.js'
import { createDoc } from './create-doc.js'
import { transact } from './transact.js'

describe('upsertPoint', () => {
  test('insert new point', () => {
    const doc = createDoc()

    const pointId = transact(doc, () =>
      upsertPoint({
        doc,
        streamId: 'streamId',
        startedAt: 1,
        value: 'test',
      }),
    )
    assertOk(pointId)

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

    const [pointIdA, pointIdB] = transact(doc, () => [
      upsertPoint({
        doc,
        streamId: 'streamId',
        startedAt: 1,
        value: 'test',
      }),
      upsertPoint({
        doc,
        streamId: 'streamId',
        startedAt: 1,
        value: 'test2',
      }),
    ])
    assertOk(pointIdA)
    assertOk(pointIdB)

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
