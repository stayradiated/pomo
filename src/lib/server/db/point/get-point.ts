import { errorBoundary } from '@stayradiated/error-boundary'

import type { PointId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Point } from '#lib/server/types.js'

type GetPoint = {
  db: KyselyDb
  where: {
    userId: UserId
    pointId: PointId
  }
}

const getPoint = async (options: GetPoint): Promise<Point[] | Error> => {
  const { db, where } = options

  return errorBoundary(() =>
    db
      .selectFrom('point')
      .selectAll()
      .where('id', '=', where.pointId)
      .where('userId', '=', where.userId)
      .execute(),
  )
}

export { getPoint }
