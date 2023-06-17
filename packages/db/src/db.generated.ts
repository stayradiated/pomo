import type { ColumnType } from 'kysely'
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type Label = {
  id: string
  name: string
  createdAt: number
  updatedAt: number | null
}
export type Point = {
  id: string
  streamId: string
  value: string
  startedAt: number
  createdAt: number
  updatedAt: number | null
}
export type PointLabel = {
  pointId: string
  labelId: string
  createdAt: number
  updatedAt: number | null
}
export type Stream = {
  id: string
  name: string
  createdAt: number
  updatedAt: number | null
}
export type User = {
  id: string
  createdAt: number
  updatedAt: number | null
  timeZone: Generated<string>
}
export type DB = {
  Label: Label
  Point: Point
  PointLabel: PointLabel
  Stream: Stream
  User: User
}
