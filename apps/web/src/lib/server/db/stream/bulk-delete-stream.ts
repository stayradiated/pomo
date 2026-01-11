import { errorBoundary } from '@stayradiated/error-boundary'
import type { DeleteResult } from 'kysely'

import type { StreamId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Where } from '#lib/server/db/where.js'

import { extendWhere } from '#lib/server/db/where.js'

type BulkDeleteStreamOptions = {
  db: KyselyDb
  where: Where<{
    userId: UserId
    streamId?: StreamId
  }>
}

const bulkDeleteStream = async (
  options: BulkDeleteStreamOptions,
): Promise<DeleteResult | Error> => {
  const { db, where } = options

  return errorBoundary(() => {
    let query = db.deleteFrom('stream')

    query = extendWhere(query)
      .string('id', where.streamId)
      .string('userId', where.userId)
      .done()

    return query.executeTakeFirstOrThrow()
  })
}

export { bulkDeleteStream }
