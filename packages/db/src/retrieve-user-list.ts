import type { User } from '@stayradiated/pomo-core'
import type { KyselyDb } from './db.js'

type RetrieveOptions = {
  db: KyselyDb
}

const retrieveUserList = async (options: RetrieveOptions): Promise<User[]> => {
  const { db } = options
  const userList = await db
    .selectFrom('User')
    .select(['id', 'timeZone', 'createdAt', 'updatedAt'])
    .execute()
  return userList
}

export { retrieveUserList }
