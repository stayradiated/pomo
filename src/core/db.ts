import { type Kysely } from 'kysely'
import type { DB } from '#src/db.generated.js'

export * from './db.better-sqlite.js'
export * from '#src/db.generated.js'
export type KyselyDb = Kysely<DB>
