import type { ColumnType } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type Label = {
  id: string
  name: string
  createdAt: Generated<string>
  updatedAt: string | undefined
}
export type Point = {
  id: string
  streamId: string
  value: string
  startedAt: string
  createdAt: Generated<string>
  updatedAt: string | undefined
}
export type PointLabel = {
  pointId: string
  labelId: string
  createdAt: Generated<string>
  updatedAt: string | undefined
}
export type Stream = {
  id: string
  name: string
  createdAt: Generated<string>
  updatedAt: string | undefined
}
export type DB = {
  Label: Label
  Point: Point
  PointLabel: PointLabel
  Stream: Stream
}
