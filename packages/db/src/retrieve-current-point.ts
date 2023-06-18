import type { KyselyDb } from './db.js'

type RetrieveCurrentPointOptions = {
  db: KyselyDb
  streamId: string
  currentTime: number
}

const retrieveCurrentPoint = async (options: RetrieveCurrentPointOptions) => {
  const { db, streamId, currentTime } = options

  const currentPoint = await db
    .selectFrom('Point')
    .selectAll()
    .where('streamId', '=', streamId)
    .where('startedAt', '<=', currentTime)
    .orderBy('startedAt', 'desc')
    .executeTakeFirst()

  return currentPoint
}

export { retrieveCurrentPoint }
