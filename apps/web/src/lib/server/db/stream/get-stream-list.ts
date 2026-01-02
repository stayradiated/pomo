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

  return errorBoundary(() => {
    let query = db.selectFrom('stream').selectAll()

    query = extendWhere(query)
      .string('id', where.streamId)
      .string('userId', where.userId)
      .done()

    return query.execute()
  })
}

export { getStreamList }
