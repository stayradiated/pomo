import type { Selectable } from 'kysely'
import { errorBoundary } from '@stayradiated/error-boundary'
import type { KyselyDb, Point } from './db.js'

type GetPointByIdOptions = {
  db: KyselyDb
  id: string
}

const getPointById = async (
  options: GetPointByIdOptions,
): Promise<Selectable<Point> | Error> => {
  const { db, id } = options
  return errorBoundary(async () =>
    db
      .selectFrom('Point')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirstOrThrow(),
  )
}

export { getPointById }
