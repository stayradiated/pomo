import { parseISO } from 'date-fns'
import type { PageServerLoad, Actions } from './$types';
import { retrieveStreamList, insertPoint, updatePointValue } from "@stayradiated/pomo-db"
import { getDb } from '$lib/db.js'
import { redirect } from '@sveltejs/kit';
import { getCurrentPoints } from "$lib/get-current-points";

const load = (async () => {
  const currentTime = new Date()
  const db = getDb()
  const streamList = await retrieveStreamList({ db })
  const currentPoints = await getCurrentPoints({ db, streamList, currentTime })

  return {
    currentTime,
    streamList,
    currentPoints,
  }
}) satisfies PageServerLoad;

const actions = {
  async default({ request }) {
    const formData = await request.formData()

    const currentTimeRaw = formData.get('currentTime')
    if (typeof currentTimeRaw !== 'string') {
      throw new Error('Missing currentTime')
    }
    const currentTime = parseISO(currentTimeRaw)

    const db = getDb()
    const streamList = await retrieveStreamList({ db })
    const currentPoints = await getCurrentPoints({ db, streamList, currentTime })

    for (const [key, valueRaw] of formData.entries()) {
      if (key.startsWith('stream-')) {
        if (typeof valueRaw !== 'string') {
          throw new Error('Invalid stream value')
        }
        const streamId = key.slice(7)
        const currentPoint = currentPoints.get(streamId)

        const value = valueRaw.replace(/\r/g, '')
        if (currentPoint?.value !== value) {
          if (currentPoint?.startedAt === currentTime.getTime()) {
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
    }

    throw redirect(303, '/')

  }
} satisfies Actions;

export { load, actions }
