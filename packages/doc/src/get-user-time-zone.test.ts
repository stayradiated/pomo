import Automerge from '@automerge/automerge'
import { describe, test, expect } from 'vitest'
import { getUserTimeZone } from './get-user-time-zone.js'
import { setUserTimeZone } from './set-user-time-zone.js'
import { createDoc } from './create-doc.js'

describe('getUserTimeZone', () => {
  test('should default to UTC', async () => {
    const doc = createDoc()

    const timeZone = getUserTimeZone({ doc })

    expect(timeZone).toBe('UTC')

    Automerge.free(doc)
  })

  test('should return the user time zone', async () => {
    const doc1 = createDoc()
    const doc2 = setUserTimeZone({ doc: doc1, timeZone: 'America/New_York' })

    const timeZone = getUserTimeZone({ doc: doc2 })

    expect(timeZone).toBe('America/New_York')

    Automerge.free(doc2)
  })
})
