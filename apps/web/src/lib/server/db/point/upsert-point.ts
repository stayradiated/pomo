import { errorBoundary } from '@stayradiated/error-boundary'

import type { LabelId, StreamId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Point, PointLabel } from '#lib/server/types.js'

import { genId } from '#lib/utils/gen-id.js'

type UpsertPointOptions = {
  db: KyselyDb
  where: {
    userId: UserId
    streamId: StreamId
    startedAt: number
  }
  set: {
    value: string
    labelIdList: LabelId[]
  }
  now?: number
}

const upsertPoint = async (
  options: UpsertPointOptions,
): Promise<Point | Error> => {
  const { db, where, set, now = Date.now() } = options

  const value: Point = {
    id: genId(),
    userId: where.userId,
    streamId: where.streamId,
    startedAt: where.startedAt,
    value: set.value ?? '',
    createdAt: now,
    updatedAt: now,
  }

  const point = await errorBoundary(() =>
    db
      .insertInto('point')
      .values(value)
      .onConflict((oc) =>
        oc.columns(['streamId', 'startedAt']).doUpdateSet(set),
      )
      .returningAll()
      .executeTakeFirstOrThrow(),
  )
  if (point instanceof Error) {
    return point
  }

  const pointLabelList = set.labelIdList.map(
    (labelId, index): PointLabel => ({
      pointId: point.id,
      labelId,
      userId: where.userId,
      sortOrder: index,
      createdAt: now,
      updatedAt: now,
    }),
  )

  // TODO: make this a single query
  // TODO: don't delete all pointLabels, just the ones that are being deleted

  await db.deleteFrom('pointLabel').where('pointId', '=', point.id).execute()

  await db.insertInto('pointLabel').values(pointLabelList).execute()

  return point
}

export { upsertPoint }
