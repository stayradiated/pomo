import type { PageServerLoad } from './$types.js'
import { getDoc } from '$lib/doc.js'
import {
  getUserTimeZone,
  getStreamList,
  getLabelRecord,
  retrievePointList,
} from '@stayradiated/pomo-doc'
import {
  stripComments,
  firstLine,
  startOfDayWithTimeZone,
  mapPointListToLineList,
  clampLineList,
} from '@stayradiated/pomo-core'
import type { Line } from '@stayradiated/pomo-core'
import * as dateFns from 'date-fns'

const load = (async ({ request }) => {
  const url = new URL(request.url)
  const requestDate = url.searchParams.get('date')

  const instant = requestDate
    ? dateFns.parse(requestDate, 'yyyy-MM-dd', new Date()).getTime()
    : Date.now()

  const doc = await getDoc()
  if (doc instanceof Error) {
    throw doc
  }

  const timeZone = getUserTimeZone({ doc })
  const startDate = startOfDayWithTimeZone({
    instant,
    timeZone,
  }).getTime()
  const endDate = dateFns.addDays(startDate, 1).getTime()

  const streamList = getStreamList({ doc })
  const labelRecord = getLabelRecord({ doc })

  const pointList = retrievePointList({
    doc,
    startDate,
    endDate,
    where: {},
  })

  const extendedLineList = mapPointListToLineList(pointList)
  if (extendedLineList instanceof Error) {
    throw extendedLineList
  }

  const lineList = clampLineList({
    lineList: extendedLineList,
    startDate,
    endDate,
  })

  const streamListListMap = new Map<string, Line[]>()

  for (const line of lineList) {
    const { streamId } = line

    if (!streamListListMap.has(streamId)) {
      streamListListMap.set(streamId, [])
    }

    const streamList = streamListListMap.get(streamId)!
    streamList.push(line)
  }

  return {
    streamList,
    streamListListMap,

    labelRecord,

    instant,
    timeZone,
  }
}) satisfies PageServerLoad

export { load }
