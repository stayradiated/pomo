import { z } from 'zod'
import * as process from 'node:process'
import { once } from './once.js'

const getEnv = once(() =>
  z
    .object({
      POMO_DIR: z.string(),
    })
    .parse(process.env),
)

export { getEnv }
