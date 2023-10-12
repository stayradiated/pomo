import { test, expect } from 'vitest'
import * as dateFnsTz from 'date-fns-tz'
import type { Line } from './types.js'
import { clampAndGroupLineListByDay } from './clamp-and-group-line-list-by-day.js'

test('group some lines', () => {
  const timeZone = 'Europe/London'

  const lineList: Line[] = [
    {
      id: '1',
      streamId: '',
      labelIdList: [],
      value: '',
      durationMs: 0,
      startedAt: new Date('2023-08-31T12:00:00+01:00').getTime(),
      stoppedAt: new Date('2023-09-01T12:00:00+01:00').getTime(),
    },
    {
      id: '2',
      streamId: '',
      labelIdList: [],
      value: '',
      durationMs: 0,
      startedAt: new Date('2023-09-01T12:00:00+01:00').getTime(),
      stoppedAt: new Date('2023-09-02T12:00:00+01:00').getTime(),
    },
    {
      id: '3',
      streamId: '',
      labelIdList: [],
      value: '',
      durationMs: 0,
      startedAt: new Date('2023-09-02T12:00:00+01:00').getTime(),
      stoppedAt: new Date('2023-09-03T12:00:00+01:00').getTime(),
    },
  ]

  const startDate = new Date('2023-09-01T00:00:00+01:00').getTime()
  const endDate = new Date('2023-09-02T23:59:59+01:00').getTime()

  const dayMap = clampAndGroupLineListByDay({
    lineList,
    currentTime: Date.now(),
    startDate,
    endDate,
    timeZone,
  })

  const groups = [...dayMap.entries()]
    .sort((a, b) => {
      return a[0] - b[0]
    })
    .map(([dayStart, lineList]) => {
      const date = dateFnsTz.formatInTimeZone(
        new Date(dayStart),
        timeZone,
        'yyyy-MM-dd HH:mm:ss',
      )

      return [
        date,
        lineList.map((line) => ({
          id: line.id,
          startedAt: dateFnsTz.formatInTimeZone(
            new Date(line.startedAt),
            timeZone,
            'yyyy-MM-dd HH:mm:ss',
          ),
          stoppedAt: dateFnsTz.formatInTimeZone(
            new Date(line.stoppedAt!),
            timeZone,
            'yyyy-MM-dd HH:mm:ss',
          ),
          durationMs: line.durationMs,
        })),
      ]
    })

  expect(groups).toEqual([
    [
      '2023-09-01 00:00:00',
      [
        {
          id: '1',
          durationMs: 43_200_000,
          startedAt: '2023-09-01 00:00:00',
          stoppedAt: '2023-09-01 12:00:00',
        },
        {
          id: '2',
          durationMs: 43_199_999,
          startedAt: '2023-09-01 12:00:00',
          stoppedAt: '2023-09-01 23:59:59',
        },
      ],
    ],
    [
      '2023-09-02 00:00:00',
      [
        {
          id: '2',
          durationMs: 43_200_000,
          startedAt: '2023-09-02 00:00:00',
          stoppedAt: '2023-09-02 12:00:00',
        },
        {
          id: '3',
          durationMs: 43_199_999,
          startedAt: '2023-09-02 12:00:00',
          stoppedAt: '2023-09-02 23:59:59',
        },
      ],
    ],
  ])
})
