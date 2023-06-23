import type { User, Point, Stream } from '@stayradiated/pomo-core'
import type { TypedMap, TypedDoc } from 'yjs-types'

export type JsonDoc = {
  user: Record<string, User>
  point: Record<string, Point>
  stream: Record<string, Stream>
}

export type YUser = TypedMap<User>
export type YPoint = TypedMap<Point>
export type YStream = TypedMap<Stream>

export type Doc = TypedDoc<{
  user: TypedMap<Record<string, YUser>>
  point: TypedMap<Record<string, YPoint>>
  stream: TypedMap<Record<string, YStream>>
}>

export { type User, type Stream, type Point } from '@stayradiated/pomo-core'
