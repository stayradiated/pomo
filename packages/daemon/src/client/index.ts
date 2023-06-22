import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../server/index.js'
import { getEnv } from './env.js'

const getTrpcClient = () => {
  const env = getEnv()

  const trpc = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: env.DAEMON_URL,
      }),
    ],
  })

  return trpc
}

export { getTrpcClient }
