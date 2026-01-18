import { errorBoundary } from '@stayradiated/error-boundary'

import type { LabelId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Where } from '#lib/server/db/where.js'
import type { Label } from '#lib/server/types.js'

import { extendWhere } from '#lib/server/db/where.js'

type GetLabelListOptions = {
  db: KyselyDb
  where: Where<{
    userId: UserId
    labelId?: LabelId
  }>
}

const getLabelList = async (
  options: GetLabelListOptions,
): Promise<Label[] | Error> => {
  const { db, where } = options

  const labelList = await errorBoundary(() => {
    let query = db.selectFrom('label').selectAll()

    query = extendWhere(query)
      .string('id', where.labelId)
      .string('userId', where.userId)
      .done()

    return query.execute()
  })

  if (labelList instanceof Error) {
    return new Error('Failed to getPointList', {
      cause: labelList,
    })
  }

  return labelList
}

export { getLabelList }
