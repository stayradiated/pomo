import { sql } from 'kysely'
import type { Selectable } from 'kysely'
import { errorBoundary } from '@stayradiated/error-boundary'
import type { KyselyDb, Point } from '#src/db.js'

type RetrieveOptions = {
  db: KyselyDb
  since: number
  filter: {
    streamId?: string
  }
}

type RetrievePointResult = Pick<
  Selectable<Point>,
  'id' | 'startedAt' | 'streamId' | 'value'
>

const retrievePointList = async (
  options: RetrieveOptions,
): Promise<RetrievePointResult[] | Error> => {
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
      .select(['Point.id', 'Point.startedAt', 'Point.streamId', 'Point.value'])
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
