import type { KyselyDb } from './db.js'

type UpdatePointStartedAtOptions = {
  db: KyselyDb,
  pointIdList: string[],
  startedAt: number
}

const updatePointStartedAt = async (options: UpdatePointStartedAtOptions): Promise<void> => {
  const { db, pointIdList, startedAt } = options
  await db.updateTable('Point')
    .set({ startedAt })
    .where('id', 'in', pointIdList)
    .execute()
}

export { updatePointStartedAt }
