import createSqliteDb from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import type { DB } from './db/types.js'

type KyselyDb = Kysely<DB>

const createKyselyDb = (databaseUrl: string): KyselyDb => {
  const sqliteDb = createSqliteDb(databaseUrl)

  const db = new Kysely<DB>({
    dialect: new SqliteDialect({
      database: sqliteDb,
    }),
  })

  return db
}

export { createKyselyDb }
export type { KyselyDb }
