import * as process from 'node:process'
import z from 'zod'
import { once } from './once.js'

const getEnv = once(() => {
  const env = z
    .object({
      POMO_DATABASE_URL: z.string(),
      POMO_DIR: z.string(),
    })
    .parse(process.env)

  return env
})

export { getEnv }
