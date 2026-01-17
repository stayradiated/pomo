import { errorBoundary } from '@stayradiated/error-boundary'
import * as dateFns from 'date-fns'

import type { KyselyDb } from '#lib/server/db/types.js'

type CheckEmailIsRateLimitedOptions = {
  db: KyselyDb
  where: {
    email: string
  }
  now?: number
}

/*
 * Returns true if the email is rate limited.
 */
const checkEmailIsRateLimited = async (
  options: CheckEmailIsRateLimitedOptions,
): Promise<boolean | Error> => {
  const { db, where, now = Date.now() } = options

  const row = await errorBoundary(() => {
    return db
      .selectFrom('emailVerification')
      .select((eb) => eb.fn.count<number>('id').as('count'))
      .where('email', '=', where.email)
      .where('createdAt', '>', dateFns.subSeconds(now, 10).getTime())
      .executeTakeFirstOrThrow()
  })
  if (row instanceof Error) {
    return row
  }
  if (row.count >= 1) {
    return true
  }

  return false
}

export { checkEmailIsRateLimited }
