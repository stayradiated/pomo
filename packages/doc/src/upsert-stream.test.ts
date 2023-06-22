import Automerge from '@automerge/automerge'
import { describe, test, expect } from 'vitest'
import { upsertStream } from './upsert-stream.js'
import { createDoc } from './create-doc.js'

describe('upsertStream', () => {
  test('insert new stream', () => {
    let doc = createDoc()
    doc = upsertStream({
      doc,
      name: 'test',
    })

    const keys = Object.keys(doc.stream)
    expect(keys.length).toBe(1)

    const streamId = keys[0]!
    expect(streamId).toBeTypeOf('string')

    const stream = doc.stream[streamId]!
    expect(stream).toBeTypeOf('object')

    expect(stream.id).toBeTypeOf('string')
    expect(stream.name).toBe('test')
    expect(stream.createdAt).toBeTypeOf('number')
    expect(stream.updatedAt).toBe(null)

    Automerge.free(doc)
  })

  test('update existing stream', () => {
    let doc = createDoc()
    doc = upsertStream({
      doc,
      name: 'test',
    })
    doc = upsertStream({
      doc,
      name: 'test',
    })

    const keys = Object.keys(doc.stream)
    expect(keys.length).toBe(1)

    const streamId = keys[0]!
    expect(streamId).toBeTypeOf('string')

    const stream = doc.stream[streamId]!
    expect(stream).toBeTypeOf('object')

    expect(stream.id).toBeTypeOf('string')
    expect(stream.name).toBe('test')
    expect(stream.createdAt).toBeTypeOf('number')
    expect(stream.updatedAt).toBeTypeOf('number')

    Automerge.free(doc)
  })
})
