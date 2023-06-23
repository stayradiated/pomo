import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit'
import { getPointStartedAtByRef, getPointById, retrieveStreamList, getUserTimeZone, updatePointStartedAt } from '@stayradiated/pomo-doc'
import { getDoc, setDoc } from '$lib/doc';
import { getCurrentPoints } from "$lib/get-current-points";
import { toDate, formatInTimeZone } from 'date-fns-tz'
import { zfd } from 'zod-form-data'
import { z } from 'zod'
import { redirect } from '@sveltejs/kit';
import { cloneList } from '$lib/clone.js'

const load = (async ({ request }) => {
  const url = new URL(request.url)
  const ref = url.searchParams.get('ref') ?? undefined

  if (!ref) {
    throw error(400, 'Missing ref')
  }

  const doc = await getDoc()
  if (doc instanceof Error) {
    throw error(500, doc.message)
  }

  const startedAt = getPointStartedAtByRef({ doc, ref })
  if (typeof startedAt === 'undefined') {
    throw error(500, `Point ${ref} does not exist`)
  }

  const streamList = retrieveStreamList({ doc })
  const pointMap = getCurrentPoints({ doc, streamList, currentTime: startedAt})
  const pointList = [...pointMap.values()].filter((point) => {
    return point.startedAt >= startedAt
  })

  const timeZone = getUserTimeZone({ doc })
  const startedAtLocal = formatInTimeZone(startedAt, timeZone, 'yyyy-MM-dd HH:mm')

  return {
    startedAtLocal,
    streamList: cloneList(streamList),
    pointList: cloneList(pointList),
  }
}) satisfies PageServerLoad

const $schema = zfd.formData({
  startedAtLocal: zfd.text(),
  pointId: zfd.repeatable(z.array(zfd.text()).min(1))
});

const actions = {
  default: async ({ request }) => {
    const formData = $schema.parse(await request.formData())
    const { startedAtLocal, pointId: userPointIdList } = formData

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw error(500, doc.message)
    }

    // verify that each point exists
    const pointList = userPointIdList.map((pointId) => {
      const point = getPointById({ doc, id: pointId })
      if (typeof point === 'undefined') {
        throw error(400, `Point ${pointId} does not exist`)
      }
      return point
    })

    const timeZone = getUserTimeZone({ doc })
    const startedAt = toDate(startedAtLocal, { timeZone }).getTime()

    const pointIdList = [...new Set(pointList.map((point) => point.id))]

    setDoc(updatePointStartedAt({ doc, pointIdList, startedAt }))

    throw redirect(303, '/log')
  }
} satisfies Actions

export { load, actions }
