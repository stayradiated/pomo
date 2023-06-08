import { sql } from 'kysely'
import type { Selectable } from 'kysely'
import type { KyselyDb, Point } from '#src/core/db.js'

type RetrieveOptions = {
  db: KyselyDb
  since: Date
  filter: {
    streamId?: number
  }
}

type RetrievePointResult = Pick<
  Selectable<Point>,
  'id' | 'startedAt' | 'streamId' | 'value'
>

const retrievePointList = async (
  options: RetrieveOptions,
): Promise<RetrievePointResult[]> => {
  const { db, since, filter } = options

  const sinceISO = since.toISOString()

  const streamValueList = await db
    .selectFrom('Point')
    .leftJoin(
      db
        .selectFrom('Point')
        .select(['streamId', sql`MAX(startedAt)`.as('maxStartedAt')])
        .where('startedAt', '<', sinceISO)
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
        cmpr('Point.startedAt', '>', sinceISO),
        cmpr('sv2.streamId', 'is not', null),
      ]),
    )
    .$if(typeof filter.streamId === 'number', (qb) =>
      qb.where('Point.streamId', '=', filter.streamId!),
    )
    .orderBy('Point.startedAt', 'asc')
    .execute()

  return streamValueList
}

export { retrievePointList }
