import type { AnonStream } from '#lib/core/replicache/types.js'
import type { LocalMutator } from './types.ts'

import * as Key from '#lib/core/replicache/keys.js'

const streamCreate: LocalMutator<'stream_create'> = async (
  context,
  options,
) => {
  const { tx } = context
  const { streamId, name } = options

  const key = Key.stream.encode(streamId)
  const value: AnonStream = {
    name,
    index: 0,
    parentId: undefined,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  await tx.set(key, value)
}

export default streamCreate
