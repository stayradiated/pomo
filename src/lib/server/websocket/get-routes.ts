import type { WebsocketHandler } from './define.js'

import { once } from '#lib/utils/once.js'

const getRoutes = once(
  async (): Promise<WebsocketHandler[]> => [
    (await import('./handle/poke.js')).default,
  ],
)

export { getRoutes }
