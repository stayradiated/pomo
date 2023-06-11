import { errorBoundary } from '@stayradiated/error-boundary'
import mem from 'mem'
import type { KyselyDb } from '#src/db.js'

type GetStreamIdByNameOptions = {
  db: KyselyDb
  name: string
}

const getStreamIdByName = mem(
  async (options: GetStreamIdByNameOptions): Promise<string | Error> => {
    const { db, name } = options
    return errorBoundary(async () => {
      const row = await db
        .selectFrom('Stream')
        .select('id')
        .where('name', '=', name)
        .executeTakeFirstOrThrow()
      return row.id
    })
  },
  {
    cacheKey: ([options]) => options.name,
  },
)

export { getStreamIdByName }
