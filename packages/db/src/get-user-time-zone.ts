import type { KyselyDb } from './db.js'

type GetUserTimeZoneOptions = {
  db: KyselyDb
}

const getUserTimeZone = async (
  options: GetUserTimeZoneOptions,
): Promise<string> => {
  const { db } = options
  const user = await db.selectFrom('User').select('timeZone').executeTakeFirst()

  if (!user) {
    return 'UTC'
  }

  return user.timeZone
}

export { getUserTimeZone }
