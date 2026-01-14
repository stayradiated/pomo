import { errorListBoundary, listOrError } from '@stayradiated/error-boundary'
import pMap from 'p-map'

import type { LabelId, PointId, StreamId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { Snapshot } from '#lib/server/snapshot/schema.js'
import type { IdMap } from '#lib/utils/map-and-resolve-id.js'

import { upsertPoint } from '#lib/server/db/point/upsert-point.js'

import { genId } from '#lib/utils/gen-id.js'
import { createIdMap, resolveId } from '#lib/utils/map-and-resolve-id.js'

type ImportPointOptions = {
  db: KyselyDb
  snapshot: Snapshot
  userId: UserId
  streamIdMap: IdMap<StreamId>
  labelIdMap: IdMap<LabelId>
}

const importPointList = async (
  options: ImportPointOptions,
): Promise<IdMap<PointId> | Error> => {
  const { db, snapshot, userId, streamIdMap, labelIdMap } = options

  const pointIdMap = createIdMap<PointId>('Point')

  const pointList = await errorListBoundary(() =>
    pMap(
      snapshot.point,
      async (point): Promise<void | Error> => {
        const streamId = resolveId(streamIdMap, point.streamId)
        if (streamId instanceof Error) {
          return streamId
        }

        const labelIdList = listOrError(
          point.labelIdList.map((labelId) => resolveId(labelIdMap, labelId)),
        )
        if (labelIdList instanceof Error) {
          return labelIdList
        }

        const insertedPoint = await upsertPoint({
          db,
          where: {
            userId,
            streamId,
            startedAt: point.startedAt,
          },
          insert: {
            pointId: genId(),
          },
          set: {
            description: point.description,
            labelIdList,
          },
        })
        if (insertedPoint instanceof Error) {
          return new Error(
            `Could not insert point (${JSON.stringify(point)})`,
            {
              cause: insertedPoint,
            },
          )
        }

        pointIdMap.set(point.id, insertedPoint.id)
      },
      { concurrency: 10 },
    ),
  )
  if (pointList instanceof Error) {
    return pointList
  }

  return pointIdMap
}

export { importPointList }
