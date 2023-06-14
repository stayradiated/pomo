import { createKyselyDb } from "@stayradiated/pomo-db"
import createSqliteDb from 'better-sqlite3'
import { getEnv } from './env.js'
import { once } from './once.js'

const getDb = once(() => {
  const env = getEnv()

  return createKyselyDb(createSqliteDb(env.POMO_DATABASE_URL))
})

export { getDb }

