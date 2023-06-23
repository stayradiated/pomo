import type { KyselyDb } from './db.js'
import type { Point } from '@stayradiated/pomo-core'

type RetrieveOptions = {
  db: KyselyDb
}

const retrieveAllPointList = async (options: RetrieveOptions): Promise<Point[]> => {
  const { db } = options
  const pointList = await db
    .selectFrom('Point')
    .select(['id', 'streamId', 'value', 'startedAt', 'createdAt', 'updatedAt'])
    .execute()
  return pointList
}

export { retrieveAllPointList }