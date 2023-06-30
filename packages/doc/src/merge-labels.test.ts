import { describe, test, expect } from 'vitest'
import { mergeLabels } from './merge-labels.js'
import { createDocWithData } from './create-doc-with-data.js'

describe('mergeLabels', () => {
  test('should create a new user', async () => {
    const doc = createDocWithData({
      label: {
        'label-1': {
          id: 'label-1',
          name: 'Label 1',
          streamId: 'stream-1',
          createdAt: 1,
          updatedAt: null,
        },
        'label-2': {
          id: 'label-2',
          name: 'Label 2',
          streamId: 'stream-1',
          createdAt: 2,
          updatedAt: null,
        },
      },
      point: {
        'point-1': {
          id: 'point-1',
          labelIdList: ['label-1'],
          streamId: 'stream-1',
          value: '',
          startedAt: 3,
          createdAt: 3,
          updatedAt: null,
        },
      },
    })

    mergeLabels({
      doc,
      streamId: 'stream-1',
      srcLabelId: 'label-1',
      destLabelId: 'label-2',
    })

    const labelMap = doc.getMap('label')

    expect(labelMap.toJSON()).toStrictEqual({
      'label-2': {
        id: 'label-2',
        name: 'Label 2',
        streamId: 'stream-1',
        createdAt: 2,
        updatedAt: null,
      },
    })

    const pointMap = doc.getMap('point')

    expect(pointMap.toJSON()).toStrictEqual({
      'point-1': {
        id: 'point-1',
        labelIdList: ['label-2'],
        streamId: 'stream-1',
        value: '',
        startedAt: 3,
        createdAt: 3,
        updatedAt: expect.any(Number),
      },
    })
  })
})
