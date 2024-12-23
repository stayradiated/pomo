import { assertOk } from '@stayradiated/error-boundary'
import { describe, expect, test } from 'vitest'
import { createDocWithData } from './create-doc-with-data.js'
import { createDoc } from './create-doc.js'
import { setUserTimeZone } from './set-user-time-zone.js'
import { transact } from './transact.js'
import { head } from './utils/head.js'

describe('setUserTimeZone', () => {
  test('should create a new user', async () => {
    const doc = createDoc()

    assertOk(
      transact(doc, () => setUserTimeZone({ doc, timeZone: 'Europe/Paris' })),
    )

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

    assertOk(
      transact(doc, () =>
        setUserTimeZone({ doc, timeZone: 'America/New_York' }),
      ),
    )

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
