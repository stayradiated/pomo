import { describe, expect, test } from 'vitest'
import { assertOk } from '@stayradiated/error-boundary'
import { updateLabelStream } from './update-label-stream.js'
import { makeDoc } from './test-utils/make-doc.js'
import { transact } from './transact.js'

describe('updateLabelStream', () => {
  test('should update the label streamId', () => {
    const doc = makeDoc({
      stream: [
        {
          id: 'stream1',
          name: 'Stream 1',
        },
        {
          id: 'stream2',
          name: 'Stream 2',
        },
      ],
      label: [
        {
          id: 'label1',
          streamId: 'stream1',
        },
      ],
    })

    const result = transact(doc, () =>
      updateLabelStream({
        doc,
        labelId: 'label1',
        streamId: 'stream2',
      }),
    )
    assertOk(result)

    expect(doc.get('label').toJSON()).toStrictEqual({
      label1: {
        id: 'label1',
        streamId: 'stream2',
        name: '',
        parentId: null,
        color: null,
        icon: null,
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
    })
  })

  test('should update existing points with the labelId', () => {
    const doc = makeDoc({
      stream: [
        {
          id: 'stream1',
          name: 'Stream 1',
        },
        {
          id: 'stream2',
          name: 'Stream 2',
        },
      ],
      label: [
        {
          id: 'label1',
          streamId: 'stream1',
        },
        {
          id: 'label2',
          streamId: 'stream2',
        },
      ],
      point: [
        {
          id: 'point1',
          streamId: 'stream1',
          labelIdList: ['label1'],
        },
        {
          id: 'point2',
          streamId: 'stream2',
          labelIdList: ['label2'],
        },
      ],
    })

    const result = transact(doc, () =>
      updateLabelStream({
        doc,
        labelId: 'label1',
        streamId: 'stream2',
      }),
    )
    assertOk(result)

    expect(doc.get('label').toJSON()).toStrictEqual({
      label1: {
        id: 'label1',
        streamId: 'stream2',
        name: '',
        parentId: null,
        color: null,
        icon: null,
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
      label2: {
        id: 'label2',
        streamId: 'stream2',
        name: '',
        parentId: null,
        color: null,
        icon: null,
        createdAt: expect.any(Number),
        updatedAt: null,
      },
    })
    expect(doc.get('point').toJSON()).toStrictEqual({
      point1: {
        id: 'point1',
        streamId: 'stream1',
        value: '',
        labelIdList: [],
        startedAt: expect.any(Number),
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
      point2: {
        id: 'point2',
        streamId: 'stream2',
        value: '',
        labelIdList: ['label2', 'label1'],
        startedAt: expect.any(Number),
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
    })
  })

  test('should create a new point in the destination stream', () => {
    const doc = makeDoc({
      stream: [
        {
          id: 'stream1',
          name: 'Stream 1',
        },
        {
          id: 'stream2',
          name: 'Stream 2',
        },
      ],
      label: [
        {
          id: 'label1',
          streamId: 'stream1',
        },
        {
          id: 'label2',
          streamId: 'stream1',
        },
      ],
      point: [
        {
          id: 'point1',
          streamId: 'stream1',
          labelIdList: ['label1', 'label2'],
        },
      ],
    })

    assertOk(
      transact(doc, () =>
        updateLabelStream({
          doc,
          labelId: 'label1',
          streamId: 'stream2',
        }),
      ),
    )

    expect(doc.get('label').toJSON()).toStrictEqual({
      label1: {
        id: 'label1',
        streamId: 'stream2',
        name: '',
        parentId: null,
        color: null,
        icon: null,
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
      label2: {
        id: 'label2',
        streamId: 'stream1',
        name: '',
        parentId: null,
        color: null,
        icon: null,
        createdAt: expect.any(Number),
        updatedAt: null,
      },
    })

    const pointIdList = Object.keys(doc.get('point').toJSON())
    expect(pointIdList.length).toBe(2)
    const newPointId = pointIdList.find((id) => id !== 'point1')!
    expect(newPointId).toBeDefined()

    expect(doc.get('point').toJSON()).toStrictEqual({
      point1: {
        id: 'point1',
        streamId: 'stream1',
        value: '',
        labelIdList: ['label2'],
        startedAt: expect.any(Number),
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
      [newPointId]: {
        id: newPointId,
        streamId: 'stream2',
        value: '',
        labelIdList: ['label1'],
        startedAt: expect.any(Number),
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
    })
  })
})
