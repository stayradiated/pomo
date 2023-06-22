import Automerge from '@automerge/automerge'
import { describe, test, expect } from 'vitest'
import { upsertPoint } from './upsert-point.js'
import { createDoc } from './create-doc.js'

describe('upsertPoint', () => {
  test('insert new point', () => {
    let doc = createDoc()
    doc = upsertPoint({
      doc,
      streamId: 'streamId',
      startedAt: 1,
      value: 'test',
    })

    const keys = Object.keys(doc.point)
    expect(keys.length).toBe(1)

    const pointId = keys[0]!
    expect(pointId).toBeTypeOf('string')

    const point = doc.point[pointId]!
    expect(point).toBeTypeOf('object')

    expect(point.id).toBeTypeOf('string')
    expect(point.streamId).toBe('streamId')
    expect(point.startedAt).toBe(1)
    expect(point.value).toBe('test')
    expect(point.createdAt).toBeTypeOf('number')
    expect(point.updatedAt).toBe(null)

    Automerge.free(doc)
  })

  test('update existing point', () => {
    let doc = createDoc()
    doc = upsertPoint({
      doc,
      streamId: 'streamId',
      startedAt: 1,
      value: 'test',
    })
    doc = upsertPoint({
      doc,
      streamId: 'streamId',
      startedAt: 1,
      value: 'test2',
    })

    const keys = Object.keys(doc.point)
    expect(keys.length).toBe(1)

    const pointId = keys[0]!
    expect(pointId).toBeTypeOf('string')

    const point = doc.point[pointId]!
    expect(point).toBeTypeOf('object')

    expect(point.id).toBeTypeOf('string')
    expect(point.streamId).toBe('streamId')
    expect(point.startedAt).toBe(1)
    expect(point.value).toBe('test2')
    expect(point.createdAt).toBeTypeOf('number')
    expect(point.updatedAt).toBeTypeOf('number')

    Automerge.free(doc)
  })
})
