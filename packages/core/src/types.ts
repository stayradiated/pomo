type Stream = {
  id: string
  name: string
}

type Point = {
  id: string
  streamId: string
  value: string
  startedAt: string
}

type Line = {
  id: string
  streamId: string
  value: string
  startedAt: Date
  stoppedAt: Date | undefined
  durationMs: number
}

export type { Stream, Point, Line }
