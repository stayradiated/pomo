import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { appRouter } from './router.js'
import { getEnv } from './env.js'

const start = () => {
  const env = getEnv()

  const server = createHTTPServer({
    router: appRouter,
  })

  server.listen(env.PORT)

  return server
}

export { start }

export { type AppRouter } from './router.js'
