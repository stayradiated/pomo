import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import {
  getLabelRecord,
  getStreamList,
  getUserTimeZone,
  retrievePointList,
} from '@stayradiated/pomo-doc'
import { getDoc } from '$lib/doc.js'
import { formatInTimeZone } from 'date-fns-tz'
import type { Point } from '@stayradiated/pomo-doc'
import {
  startOfDayWithTimeZone,
  getCurrentPointMap,
} from '@stayradiated/pomo-core'
import * as dateFns from 'date-fns'

type GetCommonLabelsOptions = {
  pointList: Point[]
}

type StreamLabelIdListMap = Map<string, string[]>

const getCommonLabels = (
  options: GetCommonLabelsOptions,
): StreamLabelIdListMap => {
  const { pointList } = options

  // streamId → labelId → count
  const streamLabelCountMap = new Map<string, Map<string, number>>()

  for (const point of pointList) {
    const streamId = point.streamId

    if (!streamLabelCountMap.has(streamId)) {
      streamLabelCountMap.set(streamId, new Map<string, number>())
    }
    const labelCountMap = streamLabelCountMap.get(streamId)!

    for (const labelId of point.labelIdList) {
      const count = labelCountMap.get(labelId) ?? 0
      labelCountMap.set(labelId, count + 1)
    }
  }

  const streamLabelIdListMap: StreamLabelIdListMap = new Map()

  for (const [streamId, labelCountMap] of streamLabelCountMap) {
    streamLabelIdListMap.set(
      streamId,
      Array.from(labelCountMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([labelId]) => labelId),
    )
  }

  return streamLabelIdListMap
}

const load = (async () => {
  const currentTime = Date.now()
  const doc = await getDoc()
  if (doc instanceof Error) {
    throw error(500, doc.message)
  }

  const streamList = getStreamList({ doc })
  const streamIdList = streamList.map((stream) => stream.id)
  const currentPoints = getCurrentPointMap({ doc, streamIdList, currentTime })

  const timeZone = getUserTimeZone({ doc })
  const startedAtLocal = formatInTimeZone(
    Date.now(),
    timeZone,
    'yyyy-MM-dd HH:mm',
  )

  const labelRecord = getLabelRecord({ doc })

  const recentPointList = retrievePointList({
    doc,
    startDate: dateFns
      .subDays(startOfDayWithTimeZone({ instant: currentTime, timeZone }), 7)
      .getTime(),
    endDate: currentTime,
    where: {},
  })

  const commonLabelMap = getCommonLabels({
    pointList: recentPointList,
  })

  return {
    startedAtLocal,
    currentPoints,
    streamList,
    labelRecord,
    commonLabelMap,
  }
}) satisfies PageLoad

export { load }
