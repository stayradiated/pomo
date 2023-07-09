import { describe, test, expect } from 'vitest'
import type { Line } from './types.js'
import { mapLineListToSliceList } from './map-line-list-to-slice-list.js'

describe('mapLineListToSliceList', () => {
  test('two points at the same time', () => {
    const lineList: Line[] = [
      {
        id: '1',
        streamId: 'stream-1',
        value: 'a',
        labelIdList: [],
        startedAt: 1,
        stoppedAt: 4,
        durationMs: 3,
      },
      {
        id: '1',
        streamId: 'stream-2',
        value: 'b',
        labelIdList: [],
        startedAt: 1,
        stoppedAt: 4,
        durationMs: 3,
      },
    ]

    const sliceList = mapLineListToSliceList(lineList)

    expect(sliceList).toStrictEqual([
      {
        startedAt: 1,
        lineList: [
          {
            id: '1',
            streamId: 'stream-1',
            value: 'a',
            labelIdList: [],
            startedAt: 1,
            stoppedAt: 4,
            durationMs: 3,
          },
          {
            id: '1',
            streamId: 'stream-2',
            value: 'b',
            labelIdList: [],
            startedAt: 1,
            stoppedAt: 4,
            durationMs: 3,
          },
        ],
      },
    ])
  })

  test('two points at different times', () => {
    const lineList: Line[] = [
      {
        id: '1',
        streamId: 'stream-1',
        value: 'a',
        labelIdList: [],
        startedAt: 1,
        stoppedAt: 4,
        durationMs: 3,
      },
      {
        id: '1',
        streamId: 'stream-2',
        value: 'b',
        labelIdList: [],
        startedAt: 2,
        stoppedAt: 4,
        durationMs: 3,
      },
    ]

    const sliceList = mapLineListToSliceList(lineList)

    expect(sliceList).toStrictEqual([
      {
        startedAt: 1,
        lineList: [
          {
            id: '1',
            streamId: 'stream-1',
            value: 'a',
            labelIdList: [],
            startedAt: 1,
            stoppedAt: 4,
            durationMs: 3,
          },
        ],
      },
      {
        startedAt: 2,
        lineList: [
          {
            id: '1',
            streamId: 'stream-2',
            value: 'b',
            labelIdList: [],
            startedAt: 2,
            stoppedAt: 4,
            durationMs: 3,
          },
        ],
      },
    ])
  })
})
