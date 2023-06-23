import { sql } from 'kysely'
import { errorBoundary } from '@stayradiated/error-boundary'
import type { Point } from '@stayradiated/pomo-core'
import type { KyselyDb } from '#src/db.js'

type RetrieveOptions = {
  db: KyselyDb
  since: number
  filter: {
    streamId?: string
  }
}

const retrievePointList = async (
  options: RetrieveOptions,
): Promise<Point[] | Error> => {
  const { db, since, filter } = options

  return errorBoundary(async () =>
    db
      .selectFrom('Point')
      .leftJoin(
        db
          .selectFrom('Point')
          .select(['streamId', sql`MAX(startedAt)`.as('maxStartedAt')])
          .where('startedAt', '<', since)
          .groupBy('streamId')
          .as('sv2'),
        (join) =>
          join
            .onRef('Point.streamId', '=', 'sv2.streamId')
            .onRef('Point.startedAt', '=', 'sv2.maxStartedAt'),
      )
      .select([
        'Point.id',
        'Point.startedAt',
        'Point.streamId',
        'Point.value',
        'Point.createdAt',
        'Point.updatedAt',
      ])
      .where(({ or, cmpr }) =>
        or([
          cmpr('Point.startedAt', '>', since),
          cmpr('sv2.streamId', 'is not', null),
        ]),
      )
      .$if(typeof filter.streamId === 'string', (qb) =>
        qb.where('Point.streamId', '=', filter.streamId!),
      )
      .orderBy('Point.startedAt', 'asc')
      .execute(),
  )
}

export { retrievePointList }
