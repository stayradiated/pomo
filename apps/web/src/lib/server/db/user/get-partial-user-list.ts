import { errorBoundary } from '@stayradiated/error-boundary'

import type { UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Where } from '#lib/server/db/where.js'
import type { User } from '#lib/server/types.js'

import { extendWhere } from '#lib/server/db/where.js'

type GetUserListOptions = {
  db: KyselyDb
  where: Where<{
    userId: UserId
  }>
}

type PartialUser = Pick<User, 'id' | 'timeZone' | 'createdAt' | 'updatedAt'>

const getPartialUserList = async (
  options: GetUserListOptions,
): Promise<PartialUser[] | Error> => {
  const { db, where } = options

  return errorBoundary(() => {
    let query = db
      .selectFrom('user')
      .select(['id', 'timeZone', 'createdAt', 'updatedAt'])

    query = extendWhere(query).string('id', where.userId).done()

    return query.execute()
  })
}

export { getPartialUserList }
