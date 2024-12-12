import { assertOk } from '@stayradiated/error-boundary'
import { describe, expect, test } from 'vitest'
import { deleteLabels } from './delete-labels.js'
import { makeDoc } from './test-utils/make-doc.js'
import { transact } from './transact.js'

describe('deleteLabels', () => {
  test('deletes labels', () => {
    const doc = makeDoc({
      label: [
        {
          id: 'label1',
          streamId: 'stream1',
        },
        {
          id: 'label2',
          streamId: 'stream1',
        },
        {
          id: 'label3',
          streamId: 'stream2',
        },
      ],
      point: [
        {
          id: 'point1',
          streamId: 'stream1',
          labelIdList: ['label1', 'label2'],
        },
        {
          id: 'point2',
          streamId: 'stream1',
          labelIdList: ['label1', 'label2'],
        },
        {
          id: 'point3',
          streamId: 'stream2',
          labelIdList: ['label3'],
        },
      ],
      stream: [
        {
          id: 'stream1',
          name: 'stream1',
        },
        {
          id: 'stream2',
          name: 'stream2',
        },
      ],
    })

    assertOk(
      transact(doc, () =>
        deleteLabels({
          doc,
          streamId: 'stream1',
          labelIdList: ['label1', 'label2'],
        }),
      ),
    )

    expect(doc.getMap('label').toJSON()).toEqual({
      label3: {
        id: 'label3',
        streamId: 'stream2',
        name: '',
        icon: null,
        color: null,
        parentId: null,
        createdAt: expect.any(Number),
        updatedAt: null,
      },
    })

    expect(doc.getMap('point').toJSON()).toEqual({
      point1: {
        id: 'point1',
        streamId: 'stream1',
        labelIdList: [],
        startedAt: expect.any(Number),
        value: '',
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
      point2: {
        id: 'point2',
        streamId: 'stream1',
        labelIdList: [],
        startedAt: expect.any(Number),
        value: '',
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
      point3: {
        id: 'point3',
        streamId: 'stream2',
        labelIdList: ['label3'],
        startedAt: expect.any(Number),
        value: '',
        createdAt: expect.any(Number),
        updatedAt: null,
      },
    })
  })
})
