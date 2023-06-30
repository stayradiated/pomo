import { test, describe, expect } from 'vitest'
import { createDocWithData } from './create-doc-with-data.js'
import { upsertPointLabel } from './upsert-point-label.js'

describe('upsertPointLabel', () => {
  test('insert a new label on a point', () => {
    const doc = createDocWithData({
      point: {
        'point-1': {
          id: 'point-1',
          streamId: 'stream-1',
          value: 'value',
          labelIdList: [],
          startedAt: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
      label: {
        'label-1': {
          id: 'label-1',
          streamId: 'stream-1',
          name: 'label-1',
          color: null,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    })

    upsertPointLabel({
      doc,
      pointId: 'point-1',
      labelId: 'label-1',
    })

    const pointMap = doc.getMap('point')

    expect(pointMap.toJSON()).toStrictEqual({
      'point-1': {
        id: 'point-1',
        streamId: 'stream-1',
        startedAt: 0,
        value: 'value',
        labelIdList: ['label-1'],
        createdAt: 0,
        updatedAt: expect.any(Number),
      },
    })
  })

  test('do nothing if point already has label', () => {
    const doc = createDocWithData({
      point: {
        'point-1': {
          id: 'point-1',
          streamId: 'stream-1',
          value: 'value',
          labelIdList: ['label-1'],
          startedAt: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
      label: {
        'label-1': {
          id: 'label-1',
          streamId: 'stream-1',
          name: 'label-1',
          color: null,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    })

    upsertPointLabel({
      doc,
      pointId: 'point-1',
      labelId: 'label-1',
    })

    const pointMap = doc.getMap('point')

    expect(pointMap.toJSON()).toStrictEqual({
      'point-1': {
        id: 'point-1',
        streamId: 'stream-1',
        startedAt: 0,
        value: 'value',
        labelIdList: ['label-1'],
        createdAt: 0,
        updatedAt: 0,
      },
    })
  })
})
