import type { LabelId, PointId, StreamId, UserId } from '#lib/ids.js'

type LocalUser = {
  readonly id: UserId
  timeZone: string
  stravaClientId: string | undefined
  stravaClientSecret: string | undefined
  stravaSession: Record<string, unknown> | undefined
  createdAt: number
  updatedAt: number
}

type LocalLabel = {
  readonly id: LabelId
  streamId: StreamId
  name: string
  icon: string | undefined
  color: string | undefined
  parentId: LabelId | undefined
  createdAt: number
  updatedAt: number
}

type LocalPoint = {
  readonly id: PointId
  streamId: StreamId
  labelIdList: readonly LabelId[]
  value: string
  startedAt: number
  createdAt: number
  updatedAt: number
}

type LocalStream = {
  readonly id: StreamId
  name: string
  index: number
  parentId: StreamId | undefined
  createdAt: number
  updatedAt: number
}

export type {
  LocalUser as User,
  LocalLabel as Label,
  LocalPoint as Point,
  LocalStream as Stream,
}
