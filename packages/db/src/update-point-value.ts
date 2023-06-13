import type { KyselyDb } from './db.js'

type UpdatePointValueOptions = {
  db: KyselyDb,
  pointId: string,
  value: string,
}

const updatePointValue = async (options: UpdatePointValueOptions) => {
  const { db, pointId, value } = options

  const updatedAt = new Date().toISOString()

  await db
    .updateTable('Point')
    .set({ value, updatedAt })
    .where('id', '=', pointId)
    .execute()
}

export { updatePointValue }
