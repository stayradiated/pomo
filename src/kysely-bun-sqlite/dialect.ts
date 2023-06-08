import type {
  DatabaseIntrospector,
  Dialect,
  DialectAdapter,
  Driver,
  Kysely,
  QueryCompiler,
} from 'kysely'
import { BunSqliteAdapter } from './adapter.js'
import type { BunSqliteDialectConfig } from './config.js'
import { BunSqliteDriver } from './driver.js'
import { BunSqliteIntrospector } from './introspector.js'
import { BunSqliteQueryCompiler } from './query-compiler.js'

export class BunSqliteDialect implements Dialect {
  readonly #config: BunSqliteDialectConfig

  constructor(config: BunSqliteDialectConfig) {
    this.#config = { ...config }
  }

  createDriver(): Driver {
    return new BunSqliteDriver(this.#config)
  }

  createQueryCompiler(): QueryCompiler {
    return new BunSqliteQueryCompiler()
  }

  createAdapter(): DialectAdapter {
    return new BunSqliteAdapter()
  }

  createIntrospector(db: Kysely<any>): DatabaseIntrospector {
    return new BunSqliteIntrospector(db)
  }
}
