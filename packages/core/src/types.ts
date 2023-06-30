type Line = {
  id: string
  streamId: string
  value: string
  labelIdList: string[]
  startedAt: number
  stoppedAt: number | null
  durationMs: number
}

export type { Line }

export {
  type User,
  type Stream,
  type Label,
  type Point,
} from '@stayradiated/pomo-doc'
