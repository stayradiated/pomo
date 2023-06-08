import { Kysely } from 'kysely'
import { Database } from 'bun:sqlite'
import type { DB } from '#src/db.generated.js'
import { BunSqliteDialect } from '#src/kysely-bun-sqlite/index.js'

const createKyselyDb = (databaseUrl: string) => {
  const database = new Database(databaseUrl)

  const db = new Kysely<DB>({
    dialect: new BunSqliteDialect({
      database,
    }),
  })

  return db
}

export { createKyselyDb }
