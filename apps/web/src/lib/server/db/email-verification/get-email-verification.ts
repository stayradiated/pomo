import { errorBoundary } from '@stayradiated/error-boundary'

import type { EmailVerificationId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Where } from '#lib/server/db/where.js'
import type { EmailVerification } from '#lib/server/types.js'

import { extendWhere } from '#lib/server/db/where.js'

type GetEmailVerificationOptions = {
  db: KyselyDb
  where: Where<{
    emailVerificationId: EmailVerificationId
  }>
}

const getEmailVerification = async (
  options: GetEmailVerificationOptions,
): Promise<EmailVerification | undefined | Error> => {
  const { db, where } = options

  return errorBoundary(() => {
    let query = db
      .selectFrom('emailVerification')
      .selectAll('emailVerification')

    query = extendWhere(query).string('id', where.emailVerificationId).done()

    return query.executeTakeFirst()
  })
}

export { getEmailVerification }
