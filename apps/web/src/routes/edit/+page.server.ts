import type { Point, Stream } from "@stayradiated/pomo-core";
import { parseISO } from 'date-fns'
import type { PageServerLoad, Actions } from './$types';
import { retrieveStreamList, retrieveCurrentPoint, insertPoint, updatePointValue } from "@stayradiated/pomo-db"
import type { KyselyDb } from "@stayradiated/pomo-db"
import { getDb } from '$lib/db.js'
import { redirect } from '@sveltejs/kit';

type GetCurrentPointsOptions = {
  db: KyselyDb,
  streamList: Stream[],
  currentTime: Date,
}

const getCurrentPoints = async (options: GetCurrentPointsOptions): Promise<Map<string, Point>> => {
  const { db, streamList, currentTime } = options

  const output = new Map<string, Point>()

  for (const stream of streamList) {
    const currentPoint = await retrieveCurrentPoint({
      db,
      streamId: stream.id,
      currentTime,
    })
    if (currentPoint instanceof Error) {
      throw currentPoint
    }
    if (currentPoint) {
      output.set(stream.id, currentPoint)
    }
  }

  return output
}

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
          if (currentPoint?.startedAt === currentTime.toISOString()) {
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
