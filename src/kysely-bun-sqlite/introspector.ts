import type {
  DatabaseIntrospector,
  DatabaseMetadata,
  DatabaseMetadataOptions,
  SchemaMetadata,
  TableMetadata,
  Kysely,
} from 'kysely'
import {
  DEFAULT_MIGRATION_LOCK_TABLE,
  DEFAULT_MIGRATION_TABLE,
  sql,
} from 'kysely'

export class BunSqliteIntrospector implements DatabaseIntrospector {
  readonly #db: Kysely<any>

  constructor(db: Kysely<any>) {
    this.#db = db
  }

  async getSchemas(): Promise<SchemaMetadata[]> {
    // Sqlite doesn't support schemas.
    return []
  }

  async getTables(
    options: DatabaseMetadataOptions = { withInternalKyselyTables: false },
  ): Promise<TableMetadata[]> {
    let query = this.#db
      .selectFrom('sqlite_schema')
      .where('type', '=', 'table')
      .where('name', 'not like', 'sqlite_%')
      .select(['name', 'type'])
      .castTo<{ name: string; type: string }>()

    if (!options.withInternalKyselyTables) {
      query = query
        .where('name', '!=', DEFAULT_MIGRATION_TABLE)
        .where('name', '!=', DEFAULT_MIGRATION_LOCK_TABLE)
    }

    const tables = await query.execute()
    return Promise.all(
      tables.map(async ({ name, type }) => this.#getTableMetadata(name, type)),
    )
  }

  async getMetadata(
    options?: DatabaseMetadataOptions,
  ): Promise<DatabaseMetadata> {
    return {
      tables: await this.getTables(options),
    }
  }

  async #getTableMetadata(
    table: string,
    tableType: string,
  ): Promise<TableMetadata> {
    const db = this.#db

    // Get the SQL that was used to create the table.
    const createSql = await db
      .selectFrom('sqlite_master')
      .where('name', '=', table)
      .select('sql')
      .castTo<{ sql: string | undefined }>()
      .execute()

    // Try to find the name of the column that has `autoincrement` 🤦
    const autoIncrementCol = createSql[0]?.sql
      ?.split(/[(),]/)
      ?.find((it) => it.toLowerCase().includes('autoincrement'))
      ?.split(/\s+/)?.[0]
      ?.replace(/["`]/g, '')

    const columns = await db
      .selectFrom(
        sql<{
          name: string
          type: string
          notnull: 0 | 1
          dflt_value: any
        }>`pragma_table_info(${table})`.as('table_info'),
      )
      .select(['name', 'type', 'notnull', 'dflt_value'])
      .execute()

    return {
      name: table,
      isView: tableType === 'view',
      columns: columns.map((col) => ({
        name: col.name,
        dataType: col.type,
        isNullable: !col.notnull,
        isAutoIncrementing: col.name === autoIncrementCol,
        hasDefaultValue: col.dflt_value != null,
      })),
    }
  }
}
