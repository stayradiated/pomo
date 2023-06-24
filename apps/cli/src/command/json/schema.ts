import { z } from 'zod'

const $user = z.object({
  id: z.string(),
  timeZone: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
})

const $stream = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
})

const $point = z.object({
  id: z.string(),
  streamId: z.string(),
  value: z.string(),
  startedAt: z.number(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
})

const $JsonDoc = z.object({
  user: z.record($user),
  stream: z.record($stream),
  point: z.record($point),
})
type JsonDoc = z.infer<typeof $JsonDoc>

export { $JsonDoc }
export type { JsonDoc }
