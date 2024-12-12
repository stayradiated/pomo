import { assertOk } from '@stayradiated/error-boundary'
import { describe, expect, test } from 'vitest'
import { createDoc } from './create-doc.js'
import { makeDoc } from './test-utils/make-doc.js'
import { transact } from './transact.js'
import { upsertStream } from './upsert-stream.js'

describe('upsertStream', () => {
  test('insert new stream', () => {
    const doc = createDoc()

    const streamId = transact(doc, () =>
      upsertStream({
        doc,
        name: 'test',
      }),
    )
    assertOk(streamId)

    const streamMap = doc.getMap('stream')

    expect(streamMap.toJSON()).toStrictEqual({
      [streamId]: {
        id: streamId,
        name: 'test',
        index: 0,
        parentId: null,
        createdAt: expect.any(Number),
        updatedAt: null,
      },
    })
  })

  test('with existing streams', () => {
    const doc = makeDoc({
      stream: [
        {
          id: 'stream-1',
          name: 'hello',
        },
      ],
    })

    const streamId = transact(doc, () => upsertStream({ doc, name: 'world' }))
    assertOk(streamId)

    const streamMap = doc.getMap('stream')

    expect(streamMap.toJSON()).toStrictEqual({
      'stream-1': {
        id: 'stream-1',
        name: 'hello',
        index: 0,
        parentId: null,
        createdAt: expect.any(Number),
        updatedAt: null,
      },
      [streamId]: {
        id: streamId,
        name: 'world',
        index: 0,
        parentId: null,
        createdAt: expect.any(Number),
        updatedAt: null,
      },
    })
  })

  test('do not insert same stream name twice', () => {
    const doc = createDoc()

    const [streamIdA, streamIdB] = transact(doc, () => [
      upsertStream({ doc, name: 'test' }),
      upsertStream({ doc, name: 'test' }),
    ])
    assertOk(streamIdA)

    expect(streamIdA).toBe(streamIdB)

    const streamMap = doc.getMap('stream')

    expect(streamMap.toJSON()).toStrictEqual({
      [streamIdA]: {
        id: streamIdA,
        name: 'test',
        index: 0,
        parentId: null,
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
    })
  })
})
