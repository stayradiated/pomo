import * as process from 'node:process'
import { z } from 'zod'
import { once } from 'rambda'

const $schema = z.object({
  POMO_DIR: z.string(),
  PORT: z.coerce.number().default(45_230),
})

const getEnv = once(() => $schema.parse(process.env))

export { getEnv }
