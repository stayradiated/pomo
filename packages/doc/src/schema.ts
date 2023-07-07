import { z } from 'zod'

const $User = z.object({
  id: z.string(),
  timeZone: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
})

const $Stream = z.object({
  id: z.string(),
  name: z.string(),
  index: z.number(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
  parentId: z.string().nullable(),
})

const $Point = z.object({
  id: z.string(),
  streamId: z.string(),
  labelIdList: z.array(z.string()).default([]),
  value: z.string(),
  startedAt: z.number(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
})

const $Label = z.object({
  id: z.string(),
  streamId: z.string(),
  name: z.string(),
  color: z.string().nullable(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
})

const $JsonDoc = z.object({
  user: z.record($User),
  stream: z.record($Stream),
  point: z.record($Point),
  label: z.record($Label),
})

export { $User, $Stream, $Point, $Label, $JsonDoc }
