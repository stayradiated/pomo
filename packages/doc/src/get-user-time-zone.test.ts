import { describe, test, expect } from 'vitest'
import { getUserTimeZone } from './get-user-time-zone.js'
import { setUserTimeZone } from './set-user-time-zone.js'
import { createDoc } from './create-doc.js'

describe('getUserTimeZone', () => {
  test('should default to UTC', async () => {
    const doc = createDoc()

    const timeZone = getUserTimeZone({ doc })

    expect(timeZone).toBe('UTC')
  })

  test('should return the user time zone', async () => {
    const doc = createDoc()
    setUserTimeZone({ doc, timeZone: 'America/New_York' })

    const timeZone = getUserTimeZone({ doc })

    expect(timeZone).toBe('America/New_York')
  })
})
