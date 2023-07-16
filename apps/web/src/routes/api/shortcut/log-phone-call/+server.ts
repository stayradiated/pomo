import { error, text } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { z } from 'zod'
import {
  extractPhoneCallInfo,
  formatDurationHMS,
} from '@stayradiated/pomo-core'
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

  const doc = await getDoc()
  if (doc instanceof Error) {
    return error(500, doc.message)
  }

  const timeZone = getUserTimeZone({ doc })

  const streamId = transact(doc, () =>
    upsertStream({
      doc,
      name: 'Phone',
    }),
  )
  if (streamId instanceof Error) {
    return error(500, streamId.message)
  }

  const labelPerson = transact(doc, () =>
    upsertLabel({
      doc,
      streamId,
      name: callLog.name,
    }),
  )
  if (labelPerson instanceof Error) {
    return error(500, labelPerson.message)
  }

  const lines = callLog.calls.map((call) => {
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
  )

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
