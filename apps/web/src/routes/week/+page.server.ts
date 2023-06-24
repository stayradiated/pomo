import type { PageServerLoad } from './$types';
import { getDoc } from '$lib/doc.js'
import { getUserTimeZone, retrieveStreamList, retrievePointList } from '@stayradiated/pomo-doc'
import { stripComments, firstLine, startOfDayWithTimeZone, mapPointListToLineList, clampLineList } from '@stayradiated/pomo-core'
import * as dateFns from 'date-fns'

const load = (async () => {
  const doc = await getDoc()
  if (doc instanceof Error) {
    throw doc
  }

  const timeZone = getUserTimeZone({ doc })
  const startDate = startOfDayWithTimeZone({ instant: new Date('2023-06-20').getTime(), timeZone }).getTime()
  const endDate = dateFns.addDays(startDate, 1).getTime()

  const streamList = retrieveStreamList({ doc })

  const pointList = retrievePointList({
    doc,
    startDate,
    endDate,
    where: {
      streamId: 'ab78502d-6bf9-46b7-8d02-14acd02f275a'
    }
  })

  const extendedLineList = mapPointListToLineList(pointList)
  if (extendedLineList instanceof Error) {
    throw extendedLineList
  }

  const lineList = clampLineList({
    lineList: extendedLineList,
    startDate,
    endDate
  })

  const streamStartedAtMap = new Map<string, number>()
  const streamStoppedAtMap = new Map<string, number>()
  const streamDurationMap = new Map<string, Map<string, number>>()

  for (const line of lineList) {
    const { streamId, value: rawValue, durationMs } = line
    const value = firstLine(stripComments(rawValue))

    if (!streamStartedAtMap.has(streamId)) {
      streamStartedAtMap.set(streamId, line.startedAt)
    }

    streamStoppedAtMap.set(streamId, line.stoppedAt || Date.now())

    if (!streamDurationMap.has(streamId)) {
      streamDurationMap.set(streamId, new Map())
    }

    const childMap = streamDurationMap.get(streamId)!
    childMap.set(value, (childMap.get(value) ?? 0) + durationMs)
  }

  return {
    streamList,
    lineList,

    streamDurationMap,
    streamStartedAtMap,
    streamStoppedAtMap
  }
}) satisfies PageServerLoad;

export { load }
