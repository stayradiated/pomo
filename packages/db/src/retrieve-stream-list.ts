import type { Stream } from '@stayradiated/pomo-core'
import type { KyselyDb } from './db.js'

type RetrieveOptions = {
  db: KyselyDb
}

const retrieveStreamList = async (
  options: RetrieveOptions,
): Promise<Stream[]> => {
  const { db } = options
  const streamList = await db
    .selectFrom('Stream')
    .select(['id', 'name', 'createdAt', 'updatedAt'])
    .execute()
  return streamList
}

export { retrieveStreamList }
