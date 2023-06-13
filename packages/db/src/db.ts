import { Kysely, SqliteDialect } from 'kysely'
import type { Database } from 'better-sqlite3'
import type { DB as Db } from '#src/db.generated.js'

type KyselyDb = Kysely<Db>

const createKyselyDb = (database: Database): KyselyDb => {
  const db = new Kysely<Db>({
    dialect: new SqliteDialect({
      database,
    }),
  })

  return db
}

export { createKyselyDb }
export type { KyselyDb }
export * from './db.generated.js'
