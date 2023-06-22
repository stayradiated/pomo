import * as process from 'node:process'
import { z } from 'zod'
import { once } from 'rambda'

const $schema = z.object({
  DAEMON_URL: z.string().url().default('http://localhost:45230'),
})

const getEnv = once(() => $schema.parse(process.env))

export { getEnv }
