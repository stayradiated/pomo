import type { PatchOperation, ReadonlyJSONValue } from 'replicache'

import type {
  AnonLabel,
  AnonPoint,
  AnonStream,
  AnonUser,
} from '#lib/core/replicache/types.js'
import type { LabelId, UserId } from '#lib/ids.js'
import type { KyselyDb } from '#lib/server/db/types.js'
import type { CVRDiff } from '#lib/server/replicache/cvr.js'
import type { Key as GenericKey } from '#lib/utils/create-key.js'

import { getLabelList } from '#lib/server/db/label/get-label-list.js'
import { getPointList } from '#lib/server/db/point/get-point-list.js'
import { getStreamList } from '#lib/server/db/stream/get-stream-list.js'
import { getUserList } from '#lib/server/db/user/get-user-list.js'

import * as Key from '#lib/core/replicache/keys.js'

import { promiseAllRecord } from '#lib/utils/promise-all-record.js'

const buildPatchList = <
  Name extends string,
  EntityId extends string,
  Value extends { id: EntityId },
  AnonValue extends ReadonlyJSONValue,
>(
  key: GenericKey<Name, [EntityId], string>,
  diff: { dels: EntityId[]; puts: EntityId[] },
  entityList: Value[],
  transform: (entity: Value) => AnonValue,
): PatchOperation[] => {
  const patchList: PatchOperation[] = []
  for (const entityId of diff.dels) {
    patchList.push({ op: 'del', key: key.encode(entityId) })
  }
  for (const entity of entityList) {
    patchList.push({
      op: 'put',
      key: key.encode(entity.id),
      value: transform(entity),
    })
  }
  return patchList
}

type GetEntitiesOptions = {
  db: KyselyDb
  diff: CVRDiff
  sessionUserId: UserId
}

const getEntities = async (
  options: GetEntitiesOptions,
): Promise<PatchOperation[] | Error> => {
  const { db, sessionUserId, diff } = options

  const entities = await promiseAllRecord({
    point: getPointList({
      db,
      where: { userId: sessionUserId, pointId: { in: diff.point.puts } },
    }),
    label: getLabelList({
      db,
      where: { userId: sessionUserId, labelId: { in: diff.label.puts } },
    }),
    stream: getStreamList({
      db,
      where: { userId: sessionUserId, streamId: { in: diff.stream.puts } },
    }),
    user:
      diff.user.puts.length > 0
        ? getUserList({
            db,
            where: { userId: sessionUserId },
          })
        : [],
  })
  if (entities instanceof Error) {
    console.error(entities)
    return new Error('Could not get entities.', { cause: entities })
  }

  return Array.from<PatchOperation>({ length: 0 }).concat(
    buildPatchList(
      Key.point,
      diff.point,
      entities.point,
      (entity): AnonPoint => ({
        streamId: entity.streamId,
        labelIdList: entity.labelIdList as LabelId[],
        description: entity.description,
        startedAt: entity.startedAt,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      }),
    ),
    buildPatchList(
      Key.label,
      diff.label,
      entities.label,
      (entity): AnonLabel => ({
        streamId: entity.streamId,
        name: entity.name,
        icon: entity.icon ?? undefined,
        color: entity.color ?? undefined,
        parentId: entity.parentId ?? undefined,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      }),
    ),
    buildPatchList(
      Key.stream,
      diff.stream,
      entities.stream,
      (entity): AnonStream => ({
        name: entity.name,
        parentId: entity.parentId ?? undefined,
        sortOrder: entity.sortOrder,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      }),
    ),
    buildPatchList(
      Key.user,
      diff.user,
      entities.user,
      (entity): AnonUser => ({
        email: entity.email,
        timeZone: entity.timeZone,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      }),
    ),
  )
}

export { getEntities }
