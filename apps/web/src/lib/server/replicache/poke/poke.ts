import type { UserId } from '#lib/ids.js'

import { getPokeBackend } from './poke-backend.js'

const poke = (userId: UserId): void => {
  const pokeBackend = getPokeBackend()
  pokeBackend.poke(userId)
}

export { poke }
