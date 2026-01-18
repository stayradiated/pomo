import type { ServerMutator } from './types.ts'

import { updateStream } from '#lib/server/db/stream/update-stream.js'

const streamRename: ServerMutator<'stream_rename'> = async (
  context,
  options,
) => {
  const { db } = context
  const { streamId, name } = options

  await updateStream({
    db,
    where: {
      userId: context.sessionUserId,
      streamId,
    },
    set: {
      name,
    },
  })
}

export default streamRename
