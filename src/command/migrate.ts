import type { KyselyDb } from '#src/core/db.js'

type MigrateCmdOptions = {
  db: KyselyDb
}

const migrateCmd = async (_options: MigrateCmdOptions) => {
  console.log('Nothing to migrate yet')
}

export { migrateCmd }
