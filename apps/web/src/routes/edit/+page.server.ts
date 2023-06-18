import type { PageServerLoad, Actions } from './$types';
import { retrieveStreamList, insertPoint, updatePointValue, getUserTimeZone } from "@stayradiated/pomo-db"
import { getDb } from '$lib/db.js'
import { redirect } from '@sveltejs/kit';
import { getCurrentPoints } from "$lib/get-current-points";
import { zfd } from 'zod-form-data'
import { z } from 'zod'
import { toDate, formatInTimeZone } from 'date-fns-tz'

const load = (async () => {
  const currentTime = Date.now()
  const db = getDb()
  const streamList = await retrieveStreamList({ db })
  const currentPoints = await getCurrentPoints({ db, streamList, currentTime })

  const timeZone = await getUserTimeZone({ db })
  const startedAtLocal = formatInTimeZone(Date.now(), timeZone, 'yyyy-MM-dd HH:mm')

  return {
    startedAtLocal,
    streamList,
    currentPoints,
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

    const db = getDb()

    const timeZone = await getUserTimeZone({ db })
    const startedAt = toDate(startedAtLocal, { timeZone }).getTime()

    console.log({ startedAtLocal, startedAt, date: new Date(startedAt) })

    const streamList = await retrieveStreamList({ db })
    const currentPoints = await getCurrentPoints({ db, streamList, currentTime: startedAt })
    for (const streamValue of streamValueList) {
      const { id: streamId, value: valueRaw } = streamValue

      const currentPoint = currentPoints.get(streamId)

      const value = valueRaw.replace(/\r/g, '')
      if (currentPoint?.value !== value) {
        if (currentPoint?.startedAt === startedAt) {
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
            startedAt,
          })
        }
      }
    }

    throw redirect(303, '/')

  }
} satisfies Actions;

export { load, actions }
