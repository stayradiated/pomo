import type { StreamId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Snapshot } from '#lib/server/snapshot/schema.js'
import type { IdMap } from '#lib/utils/map-and-resolve-id.js'

import { insertStream } from '#lib/server/db/stream/insert-stream.js'

import { genId } from '#lib/utils/gen-id.js'
import { createIdMap, maybeResolveId } from '#lib/utils/map-and-resolve-id.js'

type ImportStreamOptions = {
  db: KyselyDb
  snapshot: Snapshot
  userId: UserId
}

const importStreamList = async (
  options: ImportStreamOptions,
): Promise<IdMap<StreamId> | Error> => {
  const { db, snapshot, userId } = options

  const streamIdMap = createIdMap<StreamId>('Stream')

  for (const stream of snapshot.stream) {
    const parentId = maybeResolveId(streamIdMap, stream.parentId)
    if (parentId instanceof Error) {
      return parentId
    }

    const insertedStream = await insertStream({
      db,
      set: {
        ...stream,
        id: genId(),
        userId,
        parentId,
      },
    })
    if (insertedStream instanceof Error) {
      return insertedStream
    }

    streamIdMap.set(stream.id, insertedStream.id)
  }

  return streamIdMap
}

export { importStreamList }
