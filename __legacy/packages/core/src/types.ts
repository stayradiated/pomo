export type Line = {
  id: string
  streamId: string
  value: string
  labelIdList: string[]
  startedAt: number
  stoppedAt: number | null
  durationMs: number
}

export type Slice = {
  startedAt: number
  lineList: Line[]
}
