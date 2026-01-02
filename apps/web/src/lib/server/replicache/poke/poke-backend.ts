import type { UserId } from '#lib/ids.js'

import { createDebounce } from '#lib/utils/debounce.js'

type Listener = () => void
type ListenerMap = Map<UserId, Set<Listener>>

import { onceGlobal } from '#lib/utils/once-global.js'

type AddListenerOptions = {
  userId: UserId
  debounceMs?: number
  callback: () => void
}

// Implements the poke backend using server-sent events.
class PokeBackend {
  private listeners: ListenerMap

  constructor() {
    this.listeners = new Map()
  }

  addListener(options: AddListenerOptions) {
    const { userId, debounceMs = 50, callback } = options

    let set = this.listeners.get(userId)
    if (!set) {
      set = new Set()
      this.listeners.set(userId, set)
    }

    const listener = createDebounce(debounceMs, callback)
    set.add(listener)
    return () => {
      this.removeListener(userId, listener)
    }
  }

  poke(userId: UserId) {
    const set = this.listeners.get(userId)
    if (!set) {
      return
    }
    for (const listener of set) {
      try {
        listener()
      } catch (e) {
        console.error(e)
      }
    }
  }

  private removeListener(userId: UserId, listener: () => void) {
    const set = this.listeners.get(userId)
    if (!set) {
      return
    }
    set.delete(listener)
  }
}

// The SSE impl has to keep process-wide state using the global object.
// Otherwise the state is lost during hot reload in dev.
const getPokeBackend = onceGlobal('__pokeBackend', (): PokeBackend => {
  return new PokeBackend()
})

export { getPokeBackend }
