import type { ServerMutator } from './types.ts'

import { insertStream } from '#lib/server/db/stream/insert-stream.js'

const stream_create: ServerMutator<'stream_create'> = async (
  context,
  options,
) => {
  const { db, sessionUserId } = context
  const { streamId, name } = options

  const stream = await insertStream({
    db,
    set: {
      id: streamId,
      userId: sessionUserId,
      name,
      index: 0,
      parentId: null,
    },
  })
  if (stream instanceof Error) {
    return stream
  }
}

export default stream_create
