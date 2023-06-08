import type { ColumnType, GeneratedAlways } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type Label = {
  id: GeneratedAlways<number>
  name: string
  createdAt: Generated<string>
  updatedAt: string | undefined
}
export type Point = {
  id: GeneratedAlways<number>
  streamId: number
  value: string
  startedAt: string
  createdAt: Generated<string>
  updatedAt: string | undefined
}
export type PointLabel = {
  pointId: number
  labelId: number
  createdAt: Generated<string>
  updatedAt: string | undefined
}
export type Stream = {
  id: GeneratedAlways<number>
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
