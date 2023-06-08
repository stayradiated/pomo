import createSqliteDb from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import type { DB } from '#src/db.generated.js'

const createKyselyDb = (databaseUrl: string) => {
  const sqliteDb = createSqliteDb(databaseUrl)

  const db = new Kysely<DB>({
    dialect: new SqliteDialect({
      database: sqliteDb,
    }),
  })

  return db
}

export { createKyselyDb }
