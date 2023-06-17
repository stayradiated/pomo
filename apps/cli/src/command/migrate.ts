import type { KyselyDb } from '@stayradiated/pomo-db'

type MigrateCmdOptions = {
  db: KyselyDb
}

const migrateCmd = async (options: MigrateCmdOptions) => {
  const { db } = options

  console.warn(`Nothing to migrate yet`)
  console.log(db.schema)
}

export { migrateCmd }
