import type { ColumnType } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type Stream = {
  id: Generated<number>
  name: string
  createdAt: Generated<string>
  updatedAt: string | undefined
  active: Generated<number>
}
export type StreamValue = {
  id: Generated<number>
  streamId: number
  value: string
  createdAt: Generated<string>
  updatedAt: string | undefined
  active: Generated<number>
  startedAt: string
  stoppedAt: string | undefined
}
export type DB = {
  Stream: Stream
  StreamValue: StreamValue
}
