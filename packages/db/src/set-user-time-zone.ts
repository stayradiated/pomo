import { randomUUID } from 'node:crypto'
import { errorBoundary } from '@stayradiated/error-boundary'
import type { KyselyDb } from './db.js'

type SetUserTimeZoneOptions = {
  db: KyselyDb
  timeZone: string
}

const setUserTimeZone = async (
  options: SetUserTimeZoneOptions,
): Promise<void | Error> => {
  const { db, timeZone } = options

  const user = await errorBoundary(async () =>
    db.selectFrom('User').select(['id']).executeTakeFirst(),
  )
  if (user instanceof Error) {
    return user
  }

  const userId = user?.id ?? randomUUID()
  const now = Date.now()

  const result = await errorBoundary(async () =>
    db
      .insertInto('User')
      .values({
        id: userId,
        timeZone,
        createdAt: now,
      })
      .onConflict((oc) =>
        oc.column('id').doUpdateSet({
          timeZone,
          updatedAt: now,
        }),
      )
      .execute(),
  )
  if (result instanceof Error) {
    return result
  }
}

export { setUserTimeZone }
