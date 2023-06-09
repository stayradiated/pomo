type Line = {
  id: string
  streamId: string
  value: string
  startedAt: Date
  stoppedAt: Date | undefined
  durationMs: number
}

export type { Line }
