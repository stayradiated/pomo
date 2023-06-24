import type { User, Point, Stream, Label } from '@stayradiated/pomo-core'
import type { TypedMap, TypedDoc, TypedArray } from 'yjs-types'

export type JsonDoc = {
  label: Record<string, Label>
  point: Record<string, Point>
  stream: Record<string, Stream>
  user: Record<string, User>
}

export type YLabel = TypedMap<Label>
export type YPoint = TypedMap<
  Omit<Point, 'labelIdList'> & {
    labelIdList: TypedArray<string>
  }
>
export type YStream = TypedMap<Stream>
export type YUser = TypedMap<User>

export type Doc = TypedDoc<{
  label: TypedMap<Record<string, YLabel>>
  point: TypedMap<Record<string, YPoint>>
  stream: TypedMap<Record<string, YStream>>
  user: TypedMap<Record<string, YUser>>
}>

export type { User, Stream, Point, Label } from '@stayradiated/pomo-core'
