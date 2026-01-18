import { errorBoundary } from '@stayradiated/error-boundary'
import * as dateFns from 'date-fns'
import type { DeleteResult } from 'kysely'

import type { KyselyDb } from '#lib/server/db/types.js'

type GarbageCollectEmailVerification = {
  db: KyselyDb
  now?: number
}

const garbageCollectEmailVerification = async (
  options: GarbageCollectEmailVerification,
): Promise<DeleteResult | Error> => {
  const { db, now = Date.now() } = options

  /*
   * note: we intentionally keep all email verifications created
   * within the last hour, even if they have no retries left.
   *
   * this is so we can rate limit how often an account can be verified.
   */

  return errorBoundary(() =>
    db
      .deleteFrom('emailVerification')
      .where('expiresAt', '<', dateFns.subHours(now, 1).getTime())
      .executeTakeFirstOrThrow(),
  )
}

export { garbageCollectEmailVerification }
