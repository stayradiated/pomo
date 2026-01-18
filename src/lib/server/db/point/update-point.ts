import { errorBoundary } from '@stayradiated/error-boundary'

import type { PointId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Point } from '#lib/server/types.js'

type UpdatePointOptions = {
  db: KyselyDb
  where: {
    userId: UserId
    pointId: PointId
  }
  set: Partial<Pick<Point, 'startedAt' | 'description'>>
  now?: number
}

const updatePoint = async (
  options: UpdatePointOptions,
): Promise<Point | Error> => {
  const { db, set, now = Date.now() } = options

  return errorBoundary(() =>
    db
      .updateTable('point')
      .set({
        startedAt: set.startedAt,
        description: set.description,
        updatedAt: now,
      })
      .where('id', '=', options.where.pointId)
      .where('userId', '=', options.where.userId)
      .returningAll()
      .executeTakeFirstOrThrow(),
  )
}

export { updatePoint }
