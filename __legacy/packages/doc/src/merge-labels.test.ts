import { assertOk } from '@stayradiated/error-boundary'
import { describe, expect, test } from 'vitest'
import { mergeLabels } from './merge-labels.js'
import { makeDoc } from './test-utils/make-doc.js'
import { transact } from './transact.js'

describe('mergeLabels', () => {
  test('should merge two labels into one', async () => {
    const doc = makeDoc({
      label: [
        {
          id: 'label-1',
          name: 'Label 1',
          streamId: 'stream-1',
        },
        {
          id: 'label-2',
          name: 'Label 2',
          streamId: 'stream-1',
        },
      ],
      point: [
        {
          id: 'point-1',
          labelIdList: ['label-1'],
          streamId: 'stream-1',
          value: '',
        },
      ],
    })

    assertOk(
      transact(doc, () =>
        mergeLabels({
          doc,
          streamId: 'stream-1',
          srcLabelId: 'label-1',
          destLabelId: 'label-2',
        }),
      ),
    )

    const labelMap = doc.getMap('label')

    expect(labelMap.toJSON()).toStrictEqual({
      'label-2': {
        id: 'label-2',
        name: 'Label 2',
        streamId: 'stream-1',
        icon: null,
        color: null,
        parentId: null,
        createdAt: expect.any(Number),
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
        startedAt: expect.any(Number),
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
    })
  })
})
