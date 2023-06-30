import type { TypedMap, TypedDoc, TypedArray } from 'yjs-types'
import type { z } from 'zod'
import {
  type $User,
  type $Stream,
  type $Point,
  type $Label,
  type $JsonDoc,
} from './schema.js'

export type User = z.infer<typeof $User>
export type Stream = z.infer<typeof $Stream>
export type Point = z.infer<typeof $Point>
export type Label = z.infer<typeof $Label>
export type JsonDoc = z.infer<typeof $JsonDoc>

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
