import { errorListBoundary } from '@stayradiated/error-boundary'
import type { Simplify } from 'type-fest'

type SuccessRecord<T extends Record<string, unknown>> = Simplify<{
  [K in keyof T]: Exclude<T[K], Error>
}>

const promiseAllRecord = async <T extends Record<string, unknown>>(
  obj: { [K in keyof T]: Promise<T[K]> | T[K] },
): Promise<SuccessRecord<T> | Error> => {
  const entries = Object.entries(obj)
  const resolvedValues = await errorListBoundary(() => {
    return Promise.all(entries.map(([, v]) => v))
  })
  if (resolvedValues instanceof Error) {
    return resolvedValues
  }
  return Object.fromEntries(
    entries.map(([k], i) => [k, resolvedValues[i]]),
  ) as SuccessRecord<T>
}

export { promiseAllRecord }
