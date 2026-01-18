import { errorBoundary } from '@stayradiated/error-boundary'

import type { StreamId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Where } from '#lib/server/db/where.js'
import type { Stream } from '#lib/server/types.js'

import { extendWhere } from '#lib/server/db/where.js'

type GetStreamListOptions = {
  db: KyselyDb
  where: Where<{
    userId: UserId
    streamId?: StreamId
  }>
}

const getStreamList = async (
  options: GetStreamListOptions,
): Promise<Stream[] | Error> => {
  const { db, where } = options

  const streamList = await errorBoundary(() => {
    let query = db.selectFrom('stream').selectAll().orderBy('sortOrder', 'asc')

    query = extendWhere(query)
      .string('id', where.streamId)
      .string('userId', where.userId)
      .done()

    return query.execute()
  })

  if (streamList instanceof Error) {
    return new Error('Failed to getStreamList', { cause: streamList })
  }

  return streamList
}

export { getStreamList }
