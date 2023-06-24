type User = {
  id: string
  timeZone: string
  createdAt: number
  updatedAt: number | null
}

type Stream = {
  id: string
  name: string
  createdAt: number
  updatedAt: number | null
}

type Point = {
  id: string
  streamId: string
  labelIdList: string[]
  value: string
  startedAt: number
  createdAt: number
  updatedAt: number | null
}

type Line = {
  id: string
  streamId: string
  value: string
  startedAt: number
  stoppedAt: number | null
  durationMs: number
}

type Label = {
  id: string
  streamId: string
  name: string
  createdAt: number
  updatedAt: number | null
}

export type { User, Stream, Point, Line, Label }
