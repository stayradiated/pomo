/*

Simplified fork of `memoize`

https://github.com/sindresorhus/memoize

Changes:
- Removed the `maxAge` option
- Removed dependency on `mimic-function`
- Removed `memoizeClear` and `memoizeDecorator` functions
- Removed support for prototype methods
- Stores value directly in the cache instead of wrapping it in an object

================================================================================

MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

================================================================================
*/

type CacheStorage<KeyType, ValueType> = {
  has: (key: KeyType) => boolean
  get: (key: KeyType) => ValueType | undefined
  set: (key: KeyType, value: ValueType) => void
  delete: (key: KeyType) => void
  clear?: () => void
}

// biome-ignore lint/suspicious/noExplicitAny: required for generic function parameter constraints
type AnyFunction = (...arguments_: readonly any[]) => unknown

type MemoizeOptions<FunctionToMemoize extends AnyFunction, CacheKeyType> = {
  readonly cacheKey?: (
    arguments_: Parameters<FunctionToMemoize>,
  ) => CacheKeyType
  readonly cache?: CacheStorage<CacheKeyType, ReturnType<FunctionToMemoize>>
}

const memoize = <FunctionToMemoize extends AnyFunction, CacheKeyType>(
  fn: FunctionToMemoize,
  {
    cacheKey,
    cache = new Map(),
  }: MemoizeOptions<FunctionToMemoize, CacheKeyType> = {},
): FunctionToMemoize => {
  const memoized = ((
    ...arguments_: Parameters<FunctionToMemoize>
  ): ReturnType<FunctionToMemoize> => {
    const key = cacheKey
      ? cacheKey(arguments_)
      : (arguments_[0] as CacheKeyType)
    if (cache.has(key)) {
      const cached = cache.get(key)
      if (cached === undefined) {
        throw new Error('Cache corruption: key exists but value is undefined')
      }
      return cached
    }
    const result = fn(...arguments_) as ReturnType<FunctionToMemoize>
    cache.set(key, result)
    return result
  }) as FunctionToMemoize

  // Preserve the original function's name
  Object.defineProperty(memoized, 'name', { value: fn.name })
  return memoized
}

export { memoize }
export type { MemoizeOptions }
