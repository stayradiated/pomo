import { errorBoundary } from '@stayradiated/error-boundary'

import type { UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { ANY_ID, Where } from '#lib/server/db/where.js'
import type { User } from '#lib/server/types.js'

import { extendWhere } from '#lib/server/db/where.js'

type GetUserOptions = {
  db: KyselyDb
  where: Where<{
    userId: UserId | typeof ANY_ID
    email?: string
  }>
}

const getUser = async (
  options: GetUserOptions,
): Promise<User | undefined | Error> => {
  const { db, where } = options

  return errorBoundary(() => {
    let query = db.selectFrom('user').selectAll('user')

    query = extendWhere(query)
      .string('id', where.userId)
      .string('email', where.email)
      .done()

    return query.executeTakeFirst()
  })
}

export { getUser }
