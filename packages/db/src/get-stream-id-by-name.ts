import { errorBoundary } from '@stayradiated/error-boundary'
import type { KyselyDb } from '#src/db.js'

type GetStreamIdByNameOptions = {
  db: KyselyDb
  name: string
}

const getStreamIdByName = async (
  options: GetStreamIdByNameOptions,
): Promise<string | Error> => {
  const { db, name } = options
  return errorBoundary(async () => {
    const row = await db
      .selectFrom('Stream')
      .select('id')
      .where('name', '=', name)
      .executeTakeFirstOrThrow()
    return row.id
  })
}

export { getStreamIdByName }
