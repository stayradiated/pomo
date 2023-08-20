import { error, text } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { z } from 'zod'
import { extractPhoneCallInfo } from '@stayradiated/pomo-core'
import { getEnv } from '$lib/env'
import { getDoc, saveDoc } from '$lib/doc'
import {
  getUserTimeZone,
  upsertStream,
  upsertLabel,
  upsertPoint,
  transact,
} from '@stayradiated/pomo-doc'
import * as chrono from 'chrono-node'
import * as dateFnsTz from 'date-fns-tz'
import { listOrError } from '@stayradiated/error-boundary'

const $PostBody = z.object({
  content: z.string(),
})

const POST = async ({ request }: RequestEvent) => {
  const { content } = $PostBody.parse(await request.json())

  const env = getEnv()

  const callLog = await extractPhoneCallInfo({
    openaiApiKey: env.OPENAI_API_KEY,
    input: content,
  })
  if (callLog instanceof Error) {
    throw error(400, callLog.message)
  }

  const doc = await getDoc()
  if (doc instanceof Error) {
    throw error(500, doc.message)
  }

  const timeZone = getUserTimeZone({ doc })

  const streamId = transact(doc, () =>
    upsertStream({
      doc,
      name: 'Phone',
    }),
  )
  if (streamId instanceof Error) {
    throw error(500, streamId.message)
  }

  const labelPerson = transact(doc, () =>
    upsertLabel({
      doc,
      streamId,
      name: callLog.name,
    }),
  )
  if (labelPerson instanceof Error) {
    throw error(500, labelPerson.message)
  }

  const lines = callLog.calls
    .filter((call) => {
      // Ignore calls that are less than 1 minute long
      return call.durationMinutes > 0
    })
    .map((call) => {
      const now = new Date()
      const startedAt = chrono
        .parseDate(`${call.date} at ${call.time}`, {
          instant: now,
          timezone: dateFnsTz.getTimezoneOffset(timeZone, now) / 1000 / 60,
        })
        .getTime()
      const durationMilliseconds = call.durationMinutes * 60 * 1000
      const stoppedAt = startedAt + durationMilliseconds

      return {
        startedAt,
        stoppedAt,
        durationMilliseconds,
      }
    })

  const upsertPointResult = listOrError(
    await transact(doc, () =>
      Promise.all(
        lines.flatMap((line) => {
          return [
            upsertPoint({
              doc,
              streamId,
              startedAt: line.startedAt,
              labelIdList: [labelPerson],
              value: '',
            }),
            upsertPoint({
              doc,
              streamId,
              startedAt: line.stoppedAt,
              labelIdList: [],
              value: '',
            }),
          ]
        }),
      ),
    ),
  )
  if (upsertPointResult instanceof Error) {
    throw error(400, upsertPointResult.message)
  }

  await saveDoc()

  return text(
    `${callLog.name}\n${lines
      .map((line) => {
        const date = dateFnsTz.formatInTimeZone(
          line.startedAt,
          timeZone,
          'PP pp',
        )
        const minutes = Math.round(line.durationMilliseconds / 1000 / 60)
        return `• ${date} (${minutes} min)`
      })
      .join('\n')}`,
  )
}

export { POST }
