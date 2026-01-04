import type {
  MutatorKey,
  ServerMutator,
  ServerMutatorDefs,
} from '#lib/mutator/types.js'

import { memoize } from '#lib/utils/memoize.js'

type ServerMutatorDefsImportMap<
  T extends ServerMutatorDefs = ServerMutatorDefs,
> = T extends T
  ? {
      [Key in keyof T & string]: Promise<{ default: T[Key] }>
    }
  : never

const mutators: ServerMutatorDefsImportMap = {
  ping: import('#lib/mutator/ping.server.js'),

  stream_create: import('#lib/mutator/stream-create.server.js'),
}

// TODO: return a typed server mutator
// biome-ignore lint/suspicious/noExplicitAny: temporary type for dynamic mutator loading
type AnyServerMutator = ServerMutator<any>

// TODO: use zod to validate the mutator arguments
const getMutator = memoize(
  async (mutatorName: string): Promise<AnyServerMutator | undefined> => {
    const mutator = await mutators[mutatorName as MutatorKey]
    return mutator?.default
  },
)

export { getMutator }
