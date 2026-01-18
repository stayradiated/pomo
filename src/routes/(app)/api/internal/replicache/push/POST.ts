import type { ReadonlyJSONValue } from 'replicache'
import { z } from 'zod'

import type { ReplicacheClientGroupId } from '#lib/ids.js'
import type { RequestHandler } from './$types.js'

import { $ReplicacheClientGroupId } from '#lib/schema.js'

import { getDb } from '#lib/server/db/get-db.js'
import { transact } from '#lib/server/db/transact.js'

import { poke } from '#lib/server/replicache/poke/poke.js'

import { printError } from '#lib/utils/print-error.js'

import { processMutation } from './process-mutation.js'

const $PushRequest = z.object({
  clientGroupID: $ReplicacheClientGroupId,
  profileID: z.string().optional(),
  pushVersion: z.number().optional(),
  schemaVersion: z.string().optional(),
  mutations: z.array(
    z.object({
      id: z.number(),
      clientID: z.string(),
      name: z.string(),
      timestamp: z.number(),
      args: z.custom<ReadonlyJSONValue>(),
    }),
  ),
})

const POST: RequestHandler = async (event) => {
  const { request, locals } = event

  const sessionUserId = locals.session?.userId
  if (!sessionUserId) {
    return new Response('Must be logged in', { status: 401 })
  }

  const push = $PushRequest.safeParse(await request.json())
  if (!push.success) {
    return new Response(z.prettifyError(push.error), { status: 400 })
  }

  const replicacheClientGroupId = push.data
    .clientGroupID as ReplicacheClientGroupId

  const db = getDb()

  let shouldPoke = false

  // Iterate each mutation in the push.
  for (const mutation of push.data.mutations) {
    const error = await transact(
      `replicache.push(${mutation.name})`,
      db,
      ({ db }) =>
        processMutation({
          db,
          sessionUserId,
          replicacheClientGroupId,
          mutation,
          isErrorMode: false,
        }),
      {
        isolationLevel: 'serializable',
      },
    )
    if (error instanceof Error) {
      console.error(`[PUSH] Error: Mutation #${mutation.id} Returned Error
  ${mutation.name}(${JSON.stringify(mutation.args)})`)
      printError(error)

      // Handle errors inside mutations by skipping and moving on. This is
      // convenient in development but you may want to reconsider as your app
      // gets close to production:
      // https://doc.replicache.dev/reference/server-push#error-handling
      const errorResult = await transact(
        `replicache.push.error(${mutation.name})`,
        db,
        ({ db }) =>
          processMutation({
            db,
            sessionUserId,
            replicacheClientGroupId,
            mutation,
            isErrorMode: true,
          }),
        {
          isolationLevel: 'serializable',
        },
      )
      if (errorResult instanceof Error) {
        // If we can't even handle the error, return a 500.
        return new Response(errorResult.message, { status: 500 })
      }
    } else {
      // only poke if the transaction was successful
      shouldPoke = true
    }
  }

  if (shouldPoke) {
    poke(sessionUserId)
  }

  return new Response('{}', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export { POST }
