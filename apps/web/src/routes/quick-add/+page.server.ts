import { error } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import {
  getLabelRecord,
  getStreamList,
  getStreamByName,
  upsertPoint,
  updatePoint,
  transact,
  getUserTimeZone,
  upsertLabel,
  retrievePointList,
} from '@stayradiated/pomo-doc'
import { getDoc, saveDoc } from '$lib/doc.js'
import { redirect } from '@sveltejs/kit'
import { getCurrentPoints } from '$lib/get-current-points'
import { zfd } from 'zod-form-data'
import { z } from 'zod'
import { toDate, formatInTimeZone } from 'date-fns-tz'
import type { Label, Point } from '@stayradiated/pomo-doc'
import { startOfDayWithTimeZone } from '@stayradiated/pomo-core'
import * as dateFns from 'date-fns'

type GetInterestingLabelsOptions = {
  pointList: Point[]
}

const getInterestingLabels = (options: GetInterestingLabelsOptions) => {
  const { pointList } = options

  const labelCountMap = new Map<string, number>()

  for (const point of pointList) {
    for (const labelId of point.labelIdList) {
      const count = labelCountMap.get(labelId) ?? 0
      labelCountMap.set(labelId, count + 1)
    }
  }

  const labelIdList = Array.from(labelCountMap.entries())
    .sort((a, b) => {
      return b[1] - a[1]
    })
    .map(([labelId]) => labelId)

  return labelIdList.slice(0, 10)
}

const load = (async () => {
  const currentTime = Date.now()
  const doc = await getDoc()
  if (doc instanceof Error) {
    throw error(500, doc.message)
  }

  const streamList = getStreamList({ doc })
  const currentPoints = getCurrentPoints({ doc, streamList, currentTime })

  const timeZone = getUserTimeZone({ doc })
  const startedAtLocal = formatInTimeZone(
    Date.now(),
    timeZone,
    'yyyy-MM-dd HH:mm',
  )

  const locationStream = getStreamByName({ doc, name: 'location' })
  if (locationStream instanceof Error) {
    throw error(500, locationStream.message)
  }

  const recentPointList = retrievePointList({
    doc,
    startDate: dateFns
      .subDays(startOfDayWithTimeZone({ instant: currentTime, timeZone }), 7)
      .getTime(),
    endDate: currentTime,
    where: {
      streamIdList: [locationStream.id],
    },
  })

  const labelRecord = getLabelRecord({ doc })
  const interestingLabelIds = getInterestingLabels({
    pointList: recentPointList,
  })

  return {
    startedAtLocal,
    currentPoints,
    streamList,
    labelRecord,
    interestingLabelIds,
  }
}) satisfies PageServerLoad

const $Schema = zfd.formData({
  startedAtLocal: zfd.text(),
})

const actions = {
  async default({ request }) {
    console.log(request)
  },
} satisfies Actions

export { load, actions }
