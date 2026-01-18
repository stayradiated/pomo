import { describe, expect, test } from 'vitest'
import { getUserTimeZone } from './get-user-time-zone.js'
import { makeDoc } from './test-utils/make-doc.js'

describe('getUserTimeZone', () => {
  test('should default to UTC', async () => {
    const doc = makeDoc({})

    const timeZone = getUserTimeZone({ doc })

    expect(timeZone).toBe('UTC')
  })

  test('should return the user time zone', async () => {
    const doc = makeDoc({
      user: {
        id: 'user1',
        timeZone: 'America/New_York',
      },
    })

    const timeZone = getUserTimeZone({ doc })

    expect(timeZone).toBe('America/New_York')
  })
})
