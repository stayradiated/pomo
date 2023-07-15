import { z } from 'zod'

const $User = z.object({
  id: z.string(),
  timeZone: z.string(),

  stravaClientId: z.string().optional(),
  stravaClientSecret: z.string().optional(),
  stravaSession: z
    .object({
      accessToken: z.string(),
      refreshToken: z.string(),
      expiresAt: z.number(),
    })
    .optional(),

  createdAt: z.number(),
  updatedAt: z.number().nullable(),
})

const $Stream = z.object({
  id: z.string(),
  name: z.string(),
  index: z.number(),
  parentId: z.string().nullable(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
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
  icon: z.string().nullable(),
  color: z.string().nullable(),
  parentId: z.string().nullable(),
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
