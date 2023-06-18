import { parseISO } from 'date-fns'
import type { PageServerLoad, Actions } from './$types';
import { retrieveStreamList, insertPoint, updatePointValue, getUserTimeZone } from "@stayradiated/pomo-db"
import { getDb } from '$lib/db.js'
import { redirect } from '@sveltejs/kit';
import { getCurrentPoints } from "$lib/get-current-points";
import { zfd } from 'zod-form-data'
import { z } from 'zod'

const load = (async () => {
  const currentTime = Date.now()
  const db = getDb()
  const streamList = await retrieveStreamList({ db })
  const currentPoints = await getCurrentPoints({ db, streamList, currentTime })
  const timeZone = await getUserTimeZone({ db })

  return {
    currentTimeUTC: currentTime,
    streamList,
    currentPoints,
    timeZone,
  }
}) satisfies PageServerLoad;

const $Schema = zfd.formData({
  startedAt: zfd.numeric(),
  stream: zfd.repeatable(z.array(z.object({
    id: zfd.text(),
    value: zfd.text(z.string().optional().default(''))
  }))),
})

const actions = {
  async default({ request }) {
    const rawFormData = await request.formData()

    const formData = $Schema.parse(rawFormData)
    const { startedAt: currentTime, stream: streamValueList } = formData

    const db = getDb()
    const streamList = await retrieveStreamList({ db })
    const currentPoints = await getCurrentPoints({ db, streamList, currentTime })
    for (const streamValue of streamValueList) {
      const { id: streamId, value: valueRaw } = streamValue

      const currentPoint = currentPoints.get(streamId)

      const value = valueRaw.replace(/\r/g, '')
      if (currentPoint?.value !== value) {
        if (currentPoint?.startedAt === currentTime) {
          await updatePointValue({
            db,
            pointId: currentPoint.id,
            value,
          })
        } else {
          await insertPoint({
            db,
            streamId,
            value,
            startedAt: currentTime,
          })
        }
      }
    }

    throw redirect(303, '/')

  }
} satisfies Actions;

export { load, actions }
