import type { Selectable } from 'kysely'
import type { KyselyDb, Point } from "./db.js"
import { errorBoundary } from '@stayradiated/error-boundary'

type GetPointByIdOptions = {
  db: KyselyDb
  id: string
}

const getPointById = (options: GetPointByIdOptions): Promise<Selectable<Point>|Error> => {
  const { db, id } = options
  return errorBoundary(() => db
    .selectFrom('Point')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow())
}

export { getPointById }
