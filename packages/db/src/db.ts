import createSqliteDb from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import type { DB as Db } from '#src/db.generated.js'

type KyselyDb = Kysely<Db>

const createKyselyDb = (databaseUrl: string): KyselyDb => {
  const sqliteDb = createSqliteDb(databaseUrl)

  const db = new Kysely<Db>({
    dialect: new SqliteDialect({
      database: sqliteDb,
    }),
  })

  return db
}

export { createKyselyDb }
export type { KyselyDb }
export * from './db.generated.js'
