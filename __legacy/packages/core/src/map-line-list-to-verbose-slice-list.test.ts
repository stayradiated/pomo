import { describe, expect, test } from 'vitest'
import { mapLineListToVerboseSliceList } from './map-line-list-to-verbose-slice-list.js'
import type { Line } from './types.js'

describe('mapLineListToVerboseSliceList', () => {
  test('two points at the same time', () => {
    const lineList: Line[] = [
      {
        id: 'point-1',
        streamId: 'stream-1',
        value: 'a',
        labelIdList: [],
        startedAt: 1,
        stoppedAt: 4,
        durationMs: 3,
      },
      {
        id: 'point-2',
        streamId: 'stream-2',
        value: 'b',
        labelIdList: [],
        startedAt: 1,
        stoppedAt: 5,
        durationMs: 4,
      },
    ]

    const sliceList = mapLineListToVerboseSliceList(lineList)

    expect(sliceList).toStrictEqual([
      {
        startedAt: 1,
        lineList: [
          {
            id: 'point-1',
            streamId: 'stream-1',
            value: 'a',
            labelIdList: [],
            startedAt: 1,
            stoppedAt: 4,
            durationMs: 3,
          },
          {
            id: 'point-2',
            streamId: 'stream-2',
            value: 'b',
            labelIdList: [],
            startedAt: 1,
            stoppedAt: 5,
            durationMs: 4,
          },
        ],
      },
    ])
  })

  test('two points at different times', () => {
    const lineList: Line[] = [
      {
        id: 'point-1',
        streamId: 'stream-1',
        value: 'a',
        labelIdList: [],
        startedAt: 1,
        stoppedAt: 4,
        durationMs: 3,
      },
      {
        id: 'point-2',
        streamId: 'stream-2',
        value: 'b',
        labelIdList: [],
        startedAt: 2,
        stoppedAt: 6,
        durationMs: 4,
      },
    ]

    const sliceList = mapLineListToVerboseSliceList(lineList)

    expect(sliceList).toStrictEqual([
      {
        startedAt: 1,
        lineList: [
          {
            id: 'point-1',
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
            id: 'point-1',
            streamId: 'stream-1',
            value: 'a',
            labelIdList: [],
            startedAt: 1,
            stoppedAt: 4,
            durationMs: 3,
          },
          {
            id: 'point-2',
            streamId: 'stream-2',
            value: 'b',
            labelIdList: [],
            startedAt: 2,
            stoppedAt: 6,
            durationMs: 4,
          },
        ],
      },
    ])
  })

  test('three points at different times', () => {
    const lineList: Line[] = [
      {
        id: 'point-1',
        streamId: 'stream-1',
        value: 'a',
        labelIdList: [],
        startedAt: 1,
        stoppedAt: 4,
        durationMs: 3,
      },
      {
        id: 'point-2',
        streamId: 'stream-2',
        value: 'b',
        labelIdList: [],
        startedAt: 2,
        stoppedAt: 6,
        durationMs: 4,
      },
      {
        id: 'point-3',
        streamId: 'stream-1',
        value: 'c',
        labelIdList: [],
        startedAt: 3,
        stoppedAt: 7,
        durationMs: 4,
      },
    ]

    const sliceList = mapLineListToVerboseSliceList(lineList)

    expect(sliceList).toStrictEqual([
      {
        startedAt: 1,
        lineList: [
          {
            id: 'point-1',
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
            id: 'point-1',
            streamId: 'stream-1',
            value: 'a',
            labelIdList: [],
            startedAt: 1,
            stoppedAt: 4,
            durationMs: 3,
          },
          {
            id: 'point-2',
            streamId: 'stream-2',
            value: 'b',
            labelIdList: [],
            startedAt: 2,
            stoppedAt: 6,
            durationMs: 4,
          },
        ],
      },
      {
        startedAt: 3,
        lineList: [
          {
            id: 'point-2',
            streamId: 'stream-2',
            value: 'b',
            labelIdList: [],
            startedAt: 2,
            stoppedAt: 6,
            durationMs: 4,
          },
          {
            id: 'point-3',
            streamId: 'stream-1',
            value: 'c',
            labelIdList: [],
            startedAt: 3,
            stoppedAt: 7,
            durationMs: 4,
          },
        ],
      },
    ])
  })

  test('four points at different times', () => {
    const lineList: Line[] = [
      {
        id: 'point-1',
        streamId: 'stream-1',
        value: 'a',
        labelIdList: [],
        startedAt: 1,
        stoppedAt: 4,
        durationMs: 3,
      },
      {
        id: 'point-2',
        streamId: 'stream-2',
        value: 'b',
        labelIdList: [],
        startedAt: 2,
        stoppedAt: 6,
        durationMs: 4,
      },
      {
        id: 'point-3',
        streamId: 'stream-1',
        value: 'c',
        labelIdList: [],
        startedAt: 3,
        stoppedAt: 7,
        durationMs: 4,
      },
      {
        id: 'point-4',
        streamId: 'stream-2',
        value: 'd',
        labelIdList: [],
        startedAt: 3,
        stoppedAt: 7,
        durationMs: 4,
      },
    ]

    const sliceList = mapLineListToVerboseSliceList(lineList)

    expect(sliceList).toStrictEqual([
      {
        startedAt: 1,
        lineList: [
          {
            id: 'point-1',
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
            id: 'point-1',
            streamId: 'stream-1',
            value: 'a',
            labelIdList: [],
            startedAt: 1,
            stoppedAt: 4,
            durationMs: 3,
          },
          {
            id: 'point-2',
            streamId: 'stream-2',
            value: 'b',
            labelIdList: [],
            startedAt: 2,
            stoppedAt: 6,
            durationMs: 4,
          },
        ],
      },
      {
        startedAt: 3,
        lineList: [
          {
            id: 'point-3',
            streamId: 'stream-1',
            value: 'c',
            labelIdList: [],
            startedAt: 3,
            stoppedAt: 7,
            durationMs: 4,
          },
          {
            id: 'point-4',
            streamId: 'stream-2',
            value: 'd',
            labelIdList: [],
            startedAt: 3,
            stoppedAt: 7,
            durationMs: 4,
          },
        ],
      },
    ])
  })
})
