import { describe, test, expect } from 'vitest'
import { head } from './utils/head.js'
import { setUserTimeZone } from './set-user-time-zone.js'
import { createDoc } from './create-doc.js'
import { createDocWithData } from './create-doc-with-data.js'

describe('setUserTimeZone', () => {
  test('should create a new user', async () => {
    const doc = createDoc()
    setUserTimeZone({ doc, timeZone: 'Europe/Paris' })

    const rootUserMap = doc.getMap('user')

    const userId = head(rootUserMap.keys())!
    expect(rootUserMap.toJSON()).toStrictEqual({
      [userId]: {
        id: userId,
        timeZone: 'Europe/Paris',
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
    })
  })

  test('should update an existing user', async () => {
    const doc = createDocWithData({
      user: {
        'user-1': {
          id: 'user-1',
          timeZone: 'Europe/Paris',
          createdAt: 1_620_000_000_000,
          updatedAt: 1_620_000_000_000,
        },
      },
      stream: {},
      point: {},
    })

    setUserTimeZone({ doc, timeZone: 'America/New_York' })

    const rootUserMap = doc.getMap('user').toJSON()

    expect(rootUserMap).toStrictEqual({
      'user-1': {
        id: 'user-1',
        timeZone: 'America/New_York',
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
    })
  })
})
