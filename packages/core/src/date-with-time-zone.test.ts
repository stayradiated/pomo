import { describe, test, expect } from 'vitest'
import * as dateFnsTz from 'date-fns-tz'
import { eachDayOfIntervalWithTimeZone } from './date-with-time-zone.js'

describe('eachDayOfIntervalWithTimeZone', () => {
  // 48 hour period, over 2 days in UTC time zone
  const startDate = new Date('2023-09-01T00:00:00Z').getTime()
  const endDate = new Date('2023-09-02T23:59:59Z').getTime()

  test('should return a list of 2 days in UTC time zone', () => {
    const timeZone = 'UTC'

    expect(
      eachDayOfIntervalWithTimeZone({
        timeZone,
        startDate,
        endDate,
      }).map((date) =>
        dateFnsTz.formatInTimeZone(date, timeZone, 'yyyy-MM-dd HH:mm:ss'),
      ),
    ).toEqual(['2023-09-01 00:00:00', '2023-09-02 00:00:00'])
  })

  test('should return a list of 3 days in Los Angeles time zone', () => {
    const timeZone = 'America/Los_Angeles'

    expect(
      eachDayOfIntervalWithTimeZone({
        timeZone,
        startDate,
        endDate,
      }).map((date) =>
        dateFnsTz.formatInTimeZone(date, timeZone, 'yyyy-MM-dd HH:mm:ss'),
      ),
    ).toEqual([
      '2023-08-31 00:00:00',
      '2023-09-01 00:00:00',
      '2023-09-02 00:00:00',
    ])
  })
})
