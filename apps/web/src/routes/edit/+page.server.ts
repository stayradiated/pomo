import { error } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types';
import { getStreamList, upsertPoint, updatePointValue, getUserTimeZone } from "@stayradiated/pomo-doc"
import { getDoc } from '$lib/doc.js'
import { redirect } from '@sveltejs/kit';
import { getCurrentPoints } from "$lib/get-current-points";
import { zfd } from 'zod-form-data'
import { z } from 'zod'
import { toDate, formatInTimeZone } from 'date-fns-tz'
import { cloneList, cloneMap } from '$lib/clone';

const load = (async () => {
  const currentTime = Date.now()
  const doc = await getDoc()
  if (doc instanceof Error) {
    throw error(500, doc.message)
  }

  const streamList = getStreamList({ doc })
  const currentPoints = getCurrentPoints({ doc, streamList, currentTime })

  const timeZone = getUserTimeZone({ doc })
  const startedAtLocal = formatInTimeZone(Date.now(), timeZone, 'yyyy-MM-dd HH:mm')

  return {
    startedAtLocal,
    streamList: cloneList(streamList),
    currentPoints: cloneMap(currentPoints),
  }
}) satisfies PageServerLoad;

const $Schema = zfd.formData({
  startedAtLocal: zfd.text(),
  stream: zfd.repeatable(z.array(z.object({
    id: zfd.text(),
    value: zfd.text(z.string().optional().default(''))
  }))),
})

const actions = {
  async default({ request }) {
    const formData = $Schema.parse(await request.formData())
    const { startedAtLocal, stream: streamValueList } = formData

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw error(500, doc.message)
    }

    const timeZone = getUserTimeZone({ doc })
    const startedAt = toDate(startedAtLocal, { timeZone }).getTime()

    const streamList = getStreamList({ doc })
    const currentPoints = getCurrentPoints({ doc, streamList, currentTime: startedAt })
    for (const streamValue of streamValueList) {
      const { id: streamId, value: valueRaw } = streamValue

      const currentPoint = currentPoints.get(streamId)

      const value = valueRaw.replace(/\r/g, '')
      if (currentPoint?.value !== value) {
        if (currentPoint?.startedAt === startedAt) {
          updatePointValue({
            doc,
            pointId: currentPoint.id,
            value,
          })
        } else {
          upsertPoint({
            doc,
            streamId,
            value,
            startedAt,
          })
        }
      }
    }

    throw redirect(303, '/')

  }
} satisfies Actions;

export { load, actions }
