import type { PageLoad } from './$types.js'
import { getDoc } from '$lib/doc.js'
import {
  getUserTimeZone,
  getStreamList,
  getLabelRecord,
  retrievePointList,
} from '@stayradiated/pomo-doc'
import {
  startOfDayWithTimeZone,
  mapPointListToLineList,
  clampLineList,
  startOfWeekWithTimeZone,
} from '@stayradiated/pomo-core'
import type { Line } from '@stayradiated/pomo-core'
import * as dateFns from 'date-fns'

const load = (async ({ url }) => {
  const requestDate = url.searchParams.get('date')

  const doc = await getDoc()
  if (doc instanceof Error) {
    throw doc
  }

  const timeZone = getUserTimeZone({ doc })

  const instant = requestDate
    ? dateFns.parse(requestDate, 'yyyy-MM-dd', new Date()).getTime()
    : startOfWeekWithTimeZone({ instant: Date.now(), timeZone }).getTime()

  const numberOfDaysInWeek = 7

  const startOfWeek = startOfDayWithTimeZone({
    instant,
    timeZone,
  }).getTime()
  const endOfWeek = dateFns.addDays(startOfWeek, numberOfDaysInWeek).getTime()

  const streamList = getStreamList({ doc })
  const labelRecord = getLabelRecord({ doc })

  const pointList = retrievePointList({
    doc,
    startDate: startOfWeek,
    endDate: endOfWeek,
    where: {},
  })

  const extendedLineList = mapPointListToLineList(pointList)
  if (extendedLineList instanceof Error) {
    throw extendedLineList
  }

  // key of map is in format yyyy-MM-dd
  const streamLineListByDate = new Map<string, Map<string, Line[]>>()

  for (let i = 0; i < numberOfDaysInWeek; i++) {
    const startDate = dateFns.addDays(startOfWeek, i).getTime()
    const endDate = dateFns.addDays(startDate, 1).getTime()
    const date = dateFns.format(startDate, 'yyyy-MM-dd')

    const lineList = clampLineList({
      lineList: extendedLineList,
      currentTime: Date.now(),
      startDate,
      endDate,
    })

    const streamLineListMap = new Map<string, Line[]>()
    for (const line of lineList) {
      const { streamId } = line

      if (!streamLineListMap.has(streamId)) {
        streamLineListMap.set(streamId, [])
      }

      const streamList = streamLineListMap.get(streamId)!
      streamList.push(line)
    }

    streamLineListByDate.set(date, streamLineListMap)
  }

  return {
    streamList,
    streamLineListByDate,

    startOfWeek,
    numberOfDaysInWeek,

    labelRecord,

    instant,
    timeZone,
  }
}) satisfies PageLoad

export { load }
