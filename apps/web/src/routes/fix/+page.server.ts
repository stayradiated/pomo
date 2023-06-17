import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit'
import { getPointStartedAtByRef, getPointById, retrieveStreamList } from '@stayradiated/pomo-db'
import { getDb } from '$lib/db';
import { getCurrentPoints } from "$lib/get-current-points";
import { parseISO } from 'date-fns'
import { zfd } from 'zod-form-data'
import { z } from 'zod'
import { errorListBoundary } from '@stayradiated/error-boundary';
import { redirect } from '@sveltejs/kit';

const load = (async ({ request }) => {
  const url = new URL(request.url)
  const ref = url.searchParams.get('ref') ?? undefined

  if (!ref) {
    throw error(400, 'Missing ref')
  }

  const db = getDb()
  const startedAt = await getPointStartedAtByRef({ db, ref })
  if (startedAt instanceof Error) {
    throw error(500, startedAt.message)
  }

  const streamList = await retrieveStreamList({ db })
  const pointMap = await getCurrentPoints({ db, streamList, currentTime: startedAt})
  const pointList = [...pointMap.values()].filter((point) => {
    return new Date(point.startedAt) >= startedAt
  })

  return {
    startedAt,
    streamList,
    pointList,
  }
}) satisfies PageServerLoad

const $schema = zfd.formData({
  datetime: zfd.text(z.string().length(24)),
  pointId: zfd.repeatable(z.array(zfd.text()).min(1))
});

const actions = {
  default: async ({ request }) => {
    const formData = $schema.parse(await request.formData())
    const { datetime, pointId: userPointIdList } = formData

    const db = getDb()

    // verify that each point exists
    const pointList = await errorListBoundary(() => Promise.all(userPointIdList.map((pointId) => {
      return getPointById({ db, id: pointId })
    })))
    if (pointList instanceof Error) {
      throw error(500, pointList.message)
    }

    const nextStartedAt = parseISO(datetime)

    const pointIdList = [...new Set(pointList.map((point) => point.id))]
    await db.updateTable('Point')
      .set({ startedAt: nextStartedAt.toISOString() })
      .where('id', 'in', pointIdList)
      .execute()

    throw redirect(303, '/log')
  }
} satisfies Actions

export { load, actions }
