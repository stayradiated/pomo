import type {
  ControlledTransaction as GenericControlledTransaction,
  Transaction as GenericTransaction,
  Kysely,
} from 'kysely'

import type DB from '#lib/__generated__/kanel/Database.js'

type KyselyDb = Kysely<DB>
type Transaction = GenericTransaction<DB>
type ControlledTransaction = GenericControlledTransaction<DB>

export type { DB, KyselyDb, Transaction, ControlledTransaction }
