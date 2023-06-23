import * as Y from 'yjs'
import type { Doc, JsonDoc, YUser, YStream, YPoint } from './types.js'

const createDocWithData = (data: JsonDoc): Doc => {
  const doc = new Y.Doc() as Doc

  const userMap = doc.getMap('user')
  for (const [key, value] of Object.entries(data.user)) {
    const user = new Y.Map() as YUser
    user.set('id', value.id)
    user.set('timeZone', value.timeZone)
    user.set('createdAt', value.createdAt)
    user.set('updatedAt', value.updatedAt)

    userMap.set(key, user)
  }

  const streamMap = doc.getMap('stream')
  for (const [key, value] of Object.entries(data.stream)) {
    const stream = new Y.Map() as YStream
    stream.set('id', value.id)
    stream.set('name', value.name)
    stream.set('createdAt', value.createdAt)
    stream.set('updatedAt', value.updatedAt)

    streamMap.set(key, stream)
  }

  const pointMap = doc.getMap('point')
  for (const [key, value] of Object.entries(data.point)) {
    const point = new Y.Map() as YPoint
    point.set('id', value.id)
    point.set('streamId', value.streamId)
    point.set('value', value.value)
    point.set('startedAt', value.startedAt)
    point.set('createdAt', value.createdAt)
    point.set('updatedAt', value.updatedAt)

    pointMap.set(key, point)
  }

  return doc
}

export { createDocWithData }
