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

const $PostBody = z.object({
  content: z.string(),
})

const POST = async ({ request }: RequestEvent) => {
  const { content } = $PostBody.parse(await request.json())

  const now = new Date()

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

  await transact(doc, () =>
    Promise.all(
      callLog.calls.flatMap((call) => {
        const startedAt = chrono
          .parseDate(`${call.date} ${call.time}`, {
            instant: now,
            timezone: timeZone,
          })
          .getTime()
        const durationMilliseconds = call.durationMinutes * 60 * 1000
        const stoppedAt = startedAt + durationMilliseconds

        return [
          upsertPoint({
            doc,
            streamId,
            startedAt,
            labelIdList: [labelPerson],
            value: '',
          }),
          upsertPoint({
            doc,
            streamId,
            startedAt: stoppedAt,
            labelIdList: [],
            value: '',
          }),
        ]
      }),
    ),
  )

  await saveDoc()

  return text(
    `${callLog.name}\n\n${callLog.calls
      .map((call) => {
        return `- ${call.date} ${call.time} (${call.durationMinutes} minutes)`
      })
      .join('\n')}`,
  )
}

export { POST }
