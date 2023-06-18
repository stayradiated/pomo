import { createKyselyDb } from '@stayradiated/pomo-db'
import createSqliteDb from 'better-sqlite3'
import { once } from './once.js'
import { getEnv } from './env.js'

const getDb = once(() => {
  const env = getEnv()

  const sqliteDb = createSqliteDb(env.POMO_DATABASE_URL)
  sqliteDb.pragma('journal_mode = WAL')

  const db = createKyselyDb(sqliteDb)

  return db
})

export { getDb }
