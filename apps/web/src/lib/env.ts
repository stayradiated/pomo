import { z } from 'zod'
import { once } from './once.js'
import * as privateEnvVars from '$env/dynamic/private'

const getEnv = once(() =>
  z
    .object({
      POMO_DIR: z.string(),
      OPENAI_API_KEY: z.string(),
    })
    .parse(privateEnvVars),
)

export { getEnv }
