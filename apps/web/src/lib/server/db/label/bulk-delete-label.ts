import { errorBoundary } from '@stayradiated/error-boundary'
import type { DeleteResult } from 'kysely'

import type { LabelId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Where } from '#lib/server/db/where.js'

import { extendWhere } from '#lib/server/db/where.js'

type BulkDeleteLabelOptions = {
  db: KyselyDb
  where: Where<{
    userId: UserId
    labelId?: LabelId
  }>
}

const bulkDeleteLabel = async (
  options: BulkDeleteLabelOptions,
): Promise<DeleteResult | Error> => {
  const { db, where } = options

  return errorBoundary(() => {
    let query = db.deleteFrom('label')

    query = extendWhere(query)
      .string('id', where.labelId)
      .string('userId', where.userId)
      .done()

    return query.executeTakeFirstOrThrow()
  })
}

export { bulkDeleteLabel }
