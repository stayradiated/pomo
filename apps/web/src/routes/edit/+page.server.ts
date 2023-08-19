import type { PageServerLoad, Actions } from './$types'
import { error } from '@sveltejs/kit'
import {
  getPointById,
  getStreamList,
  getUserTimeZone,
  updatePointStartedAt,
  transact,
} from '@stayradiated/pomo-doc'
import { getDoc, saveDoc } from '$lib/doc'
import { getCurrentPoints } from '@stayradiated/pomo-core'
import { toDate, formatInTimeZone } from 'date-fns-tz'
import { zfd } from 'zod-form-data'
import { z } from 'zod'
import { redirect } from '@sveltejs/kit'

const load = (async ({ url }) => {
  const pointId = url.searchParams.get('ref') ?? undefined
  if (!pointId) {
    throw error(400, 'Missing ref')
  }

  const doc = await getDoc()
  if (doc instanceof Error) {
    throw error(500, doc.message)
  }

  const point = getPointById({ doc, pointId: pointId })
  if (point instanceof Error) {
    throw point
  }
  const startedAt = point.startedAt

  const streamList = getStreamList({ doc })
  const pointMap = getCurrentPoints({ doc, streamList, currentTime: startedAt })
  const pointList = [...pointMap.values()].filter((point) => {
    return point.startedAt >= startedAt
  })

  const timeZone = getUserTimeZone({ doc })
  const startedAtLocal = formatInTimeZone(
    startedAt,
    timeZone,
    'yyyy-MM-dd HH:mm',
  )

  return {
    startedAtLocal,
    streamList,
    pointList,
  }
}) satisfies PageServerLoad

const $schema = zfd.formData({
  startedAtLocal: zfd.text(),
  pointId: zfd.repeatable(z.array(zfd.text()).min(1)),
})

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
      const point = getPointById({ doc, pointId })
      if (point instanceof Error) {
        throw error(400, point.message)
      }
      return point
    })

    const timeZone = getUserTimeZone({ doc })
    const startedAt = toDate(startedAtLocal, { timeZone }).getTime()

    const pointIdList = [...new Set(pointList.map((point) => point.id))]

    const result = transact(doc, () =>
      updatePointStartedAt({ doc, pointIdList, startedAt }),
    )
    if (result instanceof Error) {
      throw error(500, result.message)
    }

    await saveDoc()

    throw redirect(303, '/log')
  },
} satisfies Actions

export { load, actions }
