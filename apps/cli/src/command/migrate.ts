import type { KyselyDb } from '@stayradiated/pomo-db'

type MigrateCmdOptions = {
  db: KyselyDb
}

const migrateCmd = async (_options: MigrateCmdOptions) => {
  console.log('Nothing to migrate yet')
}

export { migrateCmd }
