import type { z } from 'zod'

import { once } from '#lib/utils/once.js'

type Env = Record<string, string | undefined>

type EnvGetter<T> = () => T

const createEnvGetter = <T extends z.ZodType<string | undefined>>(
  env: Env,
  envVar: string,
  schema: T,
): EnvGetter<z.infer<T>> => {
  return once(() => {
    const value = schema.parse(env[envVar])
    return value
  })
}

export { createEnvGetter }
