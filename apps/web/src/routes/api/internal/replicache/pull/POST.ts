import { error } from '@sveltejs/kit'
import type { PatchOperation, PullResponseOKV1 } from 'replicache'
import { z } from 'zod'

import type {
  ReplicacheClientId,
  ReplicacheClientViewId,
  UserId,
} from '#lib/ids.js'
import type { CVR, VersionRecord } from '#lib/server/replicache/cvr.js'
import type { JSONObject } from '#lib/utils/json-value.js'
import type { RequestHandler } from './$types'

import {
  $ReplicacheClientGroupId,
  $ReplicacheClientViewId,
} from '#lib/schema.js'

import { getDb } from '#lib/server/db/get-db.js'
import { transact } from '#lib/server/db/transact.js'

import { getLabelList } from '#lib/server/db/label/get-label-list.js'
import { getLabelVersionRecord } from '#lib/server/db/label/get-label-version-record.js'
import { getPointList } from '#lib/server/db/point/get-point-list.js'
import { getPointVersionRecord } from '#lib/server/db/point/get-point-version-record.js'
import { getReplicacheClientVersionRecord } from '#lib/server/db/replicache-client/get-replicache-client-version-record.js'
import { getReplicacheClientGroup } from '#lib/server/db/replicache-client-group/get-replicache-client-group.js'
import { upsertReplicacheClientGroup } from '#lib/server/db/replicache-client-group/upsert-replicache-client-group.js'
import { getStreamList } from '#lib/server/db/stream/get-stream-list.js'
import { getStreamVersionRecord } from '#lib/server/db/stream/get-stream-version-record.js'
import { getPartialUserList } from '#lib/server/db/user/get-partial-user-list.js'
import { getUserVersionRecord } from '#lib/server/db/user/get-user-version-record.js'

import {
  diffCVR,
  EMPTY_CVR,
  isCVRDiffEmpty,
} from '#lib/server/replicache/cvr.js'

import { genId } from '#lib/utils/gen-id.js'
import { promiseAllRecord } from '#lib/utils/promise-all-record.js'

// cvrKey -> ClientViewRecord
const cvrCache = new Map<string, CVR>()

const $Cookie = z.object({
  clientViewId: $ReplicacheClientViewId,
  order: z.number(),
})

type Cookie = z.infer<typeof $Cookie>

const $PullRequest = z.object({
  clientGroupID: $ReplicacheClientGroupId,
  cookie: $Cookie.nullable(),
})

type TXResult =
  | {
      type: 'NO_OP'
    }
  | {
      type: 'SUCCESS'
      entities: {
        [index: string]: { dels: string[]; puts: JSONObject[] }
      }
      clients: VersionRecord<ReplicacheClientId>
      nextCVR: CVR
      nextCVRVersion: number
    }

const POST: RequestHandler = async ({ request }) => {
  const sessionUserId = 'test' as UserId
  // const sessionUserId = getSessionUserId(locals)
  // if (sessionUserId instanceof Error) {
  //   return new Response(sessionUserId.message, { status: 401 })
  // }

  const db = getDb()

  const pull = $PullRequest.safeParse(await request.json())
  if (!pull.success) {
    return new Response(z.prettifyError(pull.error), { status: 400 })
  }

  const replicacheClientGroupId = pull.data.clientGroupID
  const requestCookie = pull.data.cookie
  const prevClientViewId = requestCookie?.clientViewId

  // 1: Fetch prevCVR
  const prevCVR = prevClientViewId ? cvrCache.get(prevClientViewId) : undefined

  // 2: Init baseCVR
  const baseCVR: CVR = prevCVR ?? EMPTY_CVR

  // 3: begin transaction
  const txResult = await transact(
    'replicache.pull',
    db,
    async ({ db }): Promise<TXResult | Error> => {
      // 4-5: getClientGroup(body.clientGroupID), verify user
      const baseReplicacheClientGroup = await getReplicacheClientGroup({
        db,
        where: {
          replicacheClientGroupId,
          userId: sessionUserId,
        },
      })
      if (baseReplicacheClientGroup instanceof Error) {
        return new Error('Could not getReplicacheClientGroup', {
          cause: baseReplicacheClientGroup,
        })
      }

      // 8: Build nextCVR
      const nextCVR: CVR | Error = await promiseAllRecord({
        // 6. Read all id/version pairs from the database that should be in the
        // client view
        point: getPointVersionRecord({ db, where: { userId: sessionUserId } }),
        stream: getStreamVersionRecord({
          db,
          where: { userId: sessionUserId },
        }),
        label: getLabelVersionRecord({ db, where: { userId: sessionUserId } }),
        user: getUserVersionRecord({ db, where: { userId: sessionUserId } }),
        // 7: Read all clients in Client Group
        replicacheClient: getReplicacheClientVersionRecord({
          db,
          where: { replicacheClientGroupId },
        }),
      })
      if (nextCVR instanceof Error) {
        return new Error('Could not get nextCVR', { cause: nextCVR })
      }

      // 9: calculate diffs
      const diff = diffCVR(baseCVR, nextCVR)

      // 10: If diff is empty, return no-op PR
      if (prevCVR && isCVRDiffEmpty(diff)) {
        return {
          type: 'NO_OP',
        }
      }

      // 11: get entities
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
        user: getPartialUserList({
          db,
          where: { userId: sessionUserId },
        }),
      })
      if (entities instanceof Error) {
        return new Error('Could not get entities.', { cause: entities })
      }

      // 12: changed clients - no need to re-read clients from database,
      // we already have their versions.
      const clients: VersionRecord<ReplicacheClientId> = {}
      for (const replicacheClientId of diff.replicacheClient.puts) {
        clients[replicacheClientId] =
          nextCVR.replicacheClient[replicacheClientId] ?? 0
      }

      // 13: newCVRVersion
      const baseCVRVersion = pull.data.cookie?.order ?? 0
      const nextCVRVersion =
        Math.max(baseCVRVersion, baseReplicacheClientGroup.cvrVersion) + 1

      // 14: Write ClientGroupRecord
      const nextClientGroupRecord = await upsertReplicacheClientGroup({
        db,
        where: {
          replicacheClientGroupId: baseReplicacheClientGroup.id,
        },
        set: {
          userId: sessionUserId,
          cvrVersion: nextCVRVersion,
        },
      })
      if (nextClientGroupRecord instanceof Error) {
        return nextClientGroupRecord
      }

      return {
        type: 'SUCCESS',
        entities: {
          point: { dels: diff.point.dels, puts: entities.point },
          label: { dels: diff.label.dels, puts: entities.label },
          stream: { dels: diff.stream.dels, puts: entities.stream },
          user: { dels: diff.user.dels, puts: entities.user },
        },
        clients,
        nextCVR,
        nextCVRVersion,
      }
    },
    {
      isolationLevel: 'serializable',
    },
  )
  if (txResult instanceof Error) {
    console.error(txResult)
    throw error(500, txResult)
  }

  // 10: If diff is empty, return no-op PR
  if (txResult.type === 'NO_OP') {
    const body: PullResponseOKV1 = {
      cookie: pull.data.cookie,
      lastMutationIDChanges: {},
      patch: [],
    }
    return new Response(JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const { entities, clients, nextCVR, nextCVRVersion } = txResult

  // 16-17: store cvr
  const clientViewId = genId<ReplicacheClientViewId>()
  cvrCache.set(clientViewId, nextCVR)

  // 18(i): build patch
  const patch: PatchOperation[] = []
  if (prevCVR === undefined) {
    patch.push({ op: 'clear' })
  }

  for (const [name, { puts, dels }] of Object.entries(entities)) {
    for (const id of dels) {
      patch.push({ op: 'del', key: `${name}/${id}` })
    }
    for (const entity of puts) {
      patch.push({
        op: 'put',
        key: `${name}/${entity.id}`,
        value: entity,
      })
    }
  }

  // 18(ii): construct cookie
  const cookie: Cookie = {
    order: nextCVRVersion,
    clientViewId,
  }

  // 17(iii): lastMutationIDChanges
  const lastMutationIDChanges = clients

  const body: PullResponseOKV1 = {
    cookie,
    lastMutationIDChanges,
    patch,
  }

  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export { POST }
