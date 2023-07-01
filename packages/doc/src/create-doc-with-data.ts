import * as Y from 'yjs'
import type { Doc, JsonDoc, YUser, YStream, YPoint, YLabel } from './types.js'

const createDocWithData = (data: Partial<JsonDoc>): Doc => {
  const doc = new Y.Doc() as Doc

  const userMap = doc.getMap('user')
  for (const [key, value] of Object.entries(data.user ?? {})) {
    const user = new Y.Map(Object.entries(value)) as YUser
    userMap.set(key, user)
  }

  const streamMap = doc.getMap('stream')
  for (const [key, value] of Object.entries(data.stream ?? {})) {
    const stream = new Y.Map(Object.entries(value)) as YStream
    streamMap.set(key, stream)
  }

  const pointMap = doc.getMap('point')
  for (const [key, value] of Object.entries(data.point ?? {})) {
    const point = new Y.Map(Object.entries(value)) as YPoint
    point.set('labelIdList', Y.Array.from(value.labelIdList))
    pointMap.set(key, point)
  }

  const labelMap = doc.getMap('label')
  for (const [key, value] of Object.entries(data.label ?? {})) {
    const label = new Y.Map(Object.entries(value)) as YLabel
    labelMap.set(key, label)
  }

  return doc
}

export { createDocWithData }
