import { errorBoundary } from '@stayradiated/error-boundary'

import type { PointId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Where } from '#lib/server/db/where.js'
import type { PointWithLabelList } from '#lib/server/types.js'

import { extendWhere } from '#lib/server/db/where.js'

type GetPointListOptions = {
  db: KyselyDb
  where: Where<{
    userId: UserId
    pointId?: PointId
  }>
}

const getPointList = async (
  options: GetPointListOptions,
): Promise<PointWithLabelList[] | Error> => {
  const { db, where } = options

  return errorBoundary(() => {
    let query = db.selectFrom('pointWithLabelList').selectAll()

    query = extendWhere(query)
      .string('id', where.pointId)
      .string('userId', where.userId)
      .done()

    return query.execute()
  })
}

export { getPointList }
