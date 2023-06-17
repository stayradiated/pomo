import type { KyselyDb } from './db.js'

type RetrieveOptions = {
  db: KyselyDb
}

const retrieveStreamList = async (options: RetrieveOptions) => {
  const { db } = options
  const streamList = await db
    .selectFrom('Stream')
    .select(['id', 'name'])
    .execute()
  return streamList
}

export { retrieveStreamList }
