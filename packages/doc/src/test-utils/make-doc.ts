import { createDocWithData } from '../create-doc-with-data.js'
import type { Label, Point, Stream } from '../types.js'

type MakeLabel = {
  id: string
  streamId: string
  name?: string
  color?: string
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
}

type MakeDocOptions = {
  label?: MakeLabel[]
  point?: MakePoint[]
  stream?: MakeStream[]
}

const makeDoc = (options: MakeDocOptions) => {
  const { label = [], point = [], stream = [] } = options

  const now = Date.now()
  const createdAt = now
  const updatedAt = null

  const labelRecord = label.reduce<Record<string, Label>>((acc, label) => {
    acc[label.id] = {
      ...label,
      name: label.name ?? '',
      color: label.color ?? '',
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
      createdAt,
      updatedAt,
    }
    return acc
  }, {})

  return createDocWithData({
    label: labelRecord,
    point: pointRecord,
    stream: streamRecord,
  })
}

export { makeDoc }
