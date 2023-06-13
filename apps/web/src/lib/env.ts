import { z } from 'zod'
import * as process from 'node:process'

const env = z
  .object({
    POMO_DATABASE_URL: z.string(),
  })
  .parse(process.env)

export { env }
