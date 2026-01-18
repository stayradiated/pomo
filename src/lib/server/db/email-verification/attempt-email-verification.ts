import { errorBoundary } from '@stayradiated/error-boundary'

import type { EmailVerificationId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { EmailVerification } from '#lib/server/types.js'

type GetEmailVerificationOptions = {
  db: KyselyDb
  where: {
    emailVerificationId: EmailVerificationId
  }
  now?: number
}

const attemptEmailVerification = async (
  options: GetEmailVerificationOptions,
): Promise<EmailVerification | Error> => {
  const { db, where, now = Date.now() } = options

  return errorBoundary(async () => {
    return db
      .updateTable('emailVerification')
      .set((eb) => ({
        retryCount: eb('retryCount', '-', 1),
      }))
      .where('id', '=', where.emailVerificationId)
      .where('expiresAt', '>', now)
      .where('retryCount', '>', 0)
      .returningAll('emailVerification')
      .executeTakeFirstOrThrow()
  })
}

export { attemptEmailVerification }
