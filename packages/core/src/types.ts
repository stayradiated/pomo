type Stream = {
  id: string
  name: string
}

type Point = {
  id: string
  streamId: string
  value: string
  startedAt: number
}

type Line = {
  id: string
  streamId: string
  value: string
  startedAt: number
  stoppedAt: number | undefined
  durationMs: number
}

export type { Stream, Point, Line }
