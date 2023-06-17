import { errorBoundary } from '@stayradiated/error-boundary'
import type { KyselyDb } from '#src/db.js'

type GetStreamNameByIdOptions = {
  db: KyselyDb
  id: string
}

const getStreamNameById = async (
  options: GetStreamNameByIdOptions,
): Promise<string | Error> => {
  const { db, id } = options
  return errorBoundary(async () => {
    const row = await db
      .selectFrom('Stream')
      .select('name')
      .where('id', '=', id)
      .executeTakeFirstOrThrow()
    return row.name
  })
}

export { getStreamNameById }
