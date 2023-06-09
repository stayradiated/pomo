import { createDocWithData } from '../create-doc-with-data.js'
import type { Label, Point, Stream } from '../types.js'

type MakeUser = {
  id: string
  timeZone: string
}

type MakeLabel = {
  id: string
  streamId: string
  name?: string
  icon?: string | null
  color?: string | null
  parentId?: string | null
}

type MakePoint = {
  id: string
  streamId: string
  labelIdList?: string[]
  startedAt?: number
  value?: string
}

type MakeStream = {
  id: string
  name?: string
  index?: number
  parentId?: string | null
}

type MakeDocOptions = {
  user?: MakeUser
  label?: MakeLabel[]
  point?: MakePoint[]
  stream?: MakeStream[]
}

const makeDoc = (options: MakeDocOptions) => {
  const { user, label = [], point = [], stream = [] } = options

  const now = Date.now()
  const createdAt = now
  const updatedAt = null

  const userRecord = user
    ? {
        [user.id]: {
          id: user.id,
          timeZone: user.timeZone ?? 'UTC',
          createdAt,
          updatedAt,
        },
      }
    : {}

  const labelRecord = label.reduce<Record<string, Label>>((acc, label) => {
    acc[label.id] = {
      ...label,
      name: label.name ?? '',
      color: label.color ?? null,
      icon: label.icon ?? null,
      parentId: label.parentId ?? null,
      createdAt,
      updatedAt,
    }
    return acc
  }, {})

  const pointRecord = point.reduce<Record<string, Point>>((acc, point) => {
    acc[point.id] = {
      ...point,
      labelIdList: point.labelIdList ?? [],
      startedAt: point.startedAt ?? now,
      value: point.value ?? '',
      createdAt,
      updatedAt,
    }
    return acc
  }, {})

  const streamRecord = stream.reduce<Record<string, Stream>>((acc, stream) => {
    acc[stream.id] = {
      ...stream,
      name: stream.name ?? '',
      index: stream.index ?? 0,
      parentId: stream.parentId ?? null,
      createdAt,
      updatedAt,
    }
    return acc
  }, {})

  return createDocWithData({
    user: userRecord,
    label: labelRecord,
    point: pointRecord,
    stream: streamRecord,
  })
}

export { makeDoc }
