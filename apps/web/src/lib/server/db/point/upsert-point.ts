import { errorBoundary } from '@stayradiated/error-boundary'

import type { LabelId, StreamId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Point } from '#lib/server/types.js'

import { genId } from '#lib/utils/gen-id.js'

type UpsertPointOptions = {
  db: KyselyDb
  where: {
    userId: UserId
    streamId: StreamId
    startedAt: number
  }
  set: {
    value?: string
    labelIdList?: LabelId[]
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
    labelIdList: set.labelIdList ?? [],
    createdAt: now,
    updatedAt: now,
  }

  return errorBoundary(() =>
    db
      .insertInto('point')
      .values(value)
      .onConflict((oc) =>
        oc.columns(['streamId', 'startedAt']).doUpdateSet(set),
      )
      .returningAll()
      .executeTakeFirstOrThrow(),
  )
}

export { upsertPoint }
