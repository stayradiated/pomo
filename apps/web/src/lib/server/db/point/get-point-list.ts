import { errorBoundary } from '@stayradiated/error-boundary'

import type { UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Point } from '#lib/server/types.js'

type GetPointListOptions = {
  db: KyselyDb
  where: {
    userId: UserId
  }
}

const getPointList = async (
  options: GetPointListOptions,
): Promise<Point[] | Error> => {
  const { db, where } = options

  return errorBoundary(() =>
    db
      .selectFrom('point')
      .selectAll()
      .where('userId', '=', where.userId)
      .execute(),
  )
}

export { getPointList }
