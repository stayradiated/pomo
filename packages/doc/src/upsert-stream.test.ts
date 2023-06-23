import { describe, test, expect } from 'vitest'
import { upsertStream } from './upsert-stream.js'
import { createDoc } from './create-doc.js'
import { createDocWithData } from './create-doc-with-data.js'

describe('upsertStream', () => {
  test('insert new stream', () => {
    const doc = createDoc()

    const streamId = upsertStream({
      doc,
      name: 'test',
    })

    const streamMap = doc.getMap('stream')

    expect(streamMap.toJSON()).toStrictEqual({
      [streamId]: {
        id: streamId,
        name: 'test',
        createdAt: expect.any(Number),
        updatedAt: null,
      },
    })
  })

  test('with existing streams', () => {
    const doc = createDocWithData({
      point: {},
      user: {},
      stream: {
        'stream-1': {
          id: 'stream-1',
          name: 'hello',
          createdAt: 1_620_000_000_000,
          updatedAt: 1_620_000_000_000,
        },
      },
    })

    const streamId = upsertStream({ doc, name: 'world' })

    const streamMap = doc.getMap('stream')

    expect(streamMap.toJSON()).toStrictEqual({
      'stream-1': {
        id: 'stream-1',
        name: 'hello',
        createdAt: 1_620_000_000_000,
        updatedAt: 1_620_000_000_000,
      },
      [streamId]: {
        id: streamId,
        name: 'world',
        createdAt: expect.any(Number),
        updatedAt: null,
      },
    })
  })

  test('do not insert same stream name twice', () => {
    const doc = createDoc()

    const streamIdA = upsertStream({ doc, name: 'test' })
    const streamIdB = upsertStream({ doc, name: 'test' })

    expect(streamIdA).toBe(streamIdB)

    const streamMap = doc.getMap('stream')

    expect(streamMap.toJSON()).toStrictEqual({
      [streamIdA]: {
        id: streamIdA,
        name: 'test',
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      },
    })
  })
})
