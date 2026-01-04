/**
 * Creates a global variable management system with async getter and sync setter.
 * This is designed to work with multiple instances of the same variable.
 *
 * Setting a variable to `undefined` is equivalent to deleting the variable.
 *
 * @param symbol - The symbol to use as the key on globalThis
 * @returns A tuple of [getter, setter] functions
 *
 * @example
 * const [getValue, setValue] = defineGlobalVariable(Symbol.for('my:value'))
 *
 * // Set the value (synchronous)
 * setValue('hello')
 *
 * // Get the value (async - returns immediately if set, otherwise waits)
 * const value = await getValue()
 */

import { onceGlobal } from './once-global.js'

type GetterOptions = {
  timeoutMs?: number
}

type Getter<T> = (options?: GetterOptions) => Promise<T>
type Setter<T> = (value: T | undefined) => void
type GlobalVariable<T> = [Getter<T>, Setter<T>]

type CallbackFn<T> = (value: T) => void

// Symbol for storing callback registry on globalThis
const CALLBACK_REGISTRY_SYMBOL = Symbol.for(
  '__defineGlobalVariable:callbackRegistry',
)

type CallbackRegistry = {
  [key: symbol]: CallbackFn<unknown>[]
}

// Initialize the callback registry if it doesn't exist
const getCallbackRegistry = onceGlobal(
  CALLBACK_REGISTRY_SYMBOL,
  (): CallbackRegistry => {
    return {}
  },
)

// Get or create callback list for a specific symbol
const getCallbackList = <T>(symbol: symbol): CallbackFn<T>[] => {
  const registry = getCallbackRegistry()
  if (!registry[symbol]) {
    registry[symbol] = []
  }
  return registry[symbol] as CallbackFn<T>[]
}

const defineGlobalVariable = <T>(
  symbol: symbol,
  defaultValue?: T,
): GlobalVariable<T> => {
  type ExtendedGlobal = typeof globalThis & {
    [key: symbol]: T | undefined
  }

  const getter: Getter<T> = async (options = {}) => {
    const { timeoutMs = 5000 } = options

    const value = (globalThis as ExtendedGlobal)[symbol]
    if (value !== undefined) {
      return value
    }

    const { promise, resolve, reject } = Promise.withResolvers<T>()

    let isResolved = false
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (typeof timeoutMs === 'number') {
      timeoutId = setTimeout(() => {
        if (!isResolved) {
          isResolved = true
          // Remove this callback from the list
          const callbackList = getCallbackList<T>(symbol)
          const index = callbackList.indexOf(callbackWrapper)
          if (index > -1) {
            callbackList.splice(index, 1)
          }
          reject(
            new Error(
              `Timeout after waiting ${timeoutMs}ms for global variable ${String(symbol)}`,
            ),
          )
        }
      }, timeoutMs)
    }

    const callbackWrapper: CallbackFn<T> = (value) => {
      if (!isResolved) {
        isResolved = true
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        resolve(value)
      }
    }

    // Add callback to the global registry
    const callbackList = getCallbackList<T>(symbol)
    callbackList.push(callbackWrapper)

    return promise
  }

  const setter: Setter<T> = (value): void => {
    if (value === undefined) {
      delete (globalThis as ExtendedGlobal)[symbol]
      return
    }

    ;(globalThis as ExtendedGlobal)[symbol] = value

    // Get the global callback list for this symbol
    const callbackList = getCallbackList<T>(symbol)

    // Copy the list to avoid mutation during iteration
    const list = [...callbackList]

    // Clear the original list
    callbackList.length = 0

    // Call all waiting callbacks
    for (const callback of list) {
      callback(value)
    }
  }

  if (typeof defaultValue !== 'undefined') {
    setter(defaultValue)
  }

  return [getter, setter]
}

export { defineGlobalVariable }
