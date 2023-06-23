import type { PageServerLoad } from './$types';
import { getDoc } from '$lib/doc.js'
import { getUserTimeZone, retrieveStreamList, retrievePointList } from '@stayradiated/pomo-doc'
import { stripComments, firstLine, startOfWeekWithTimeZone, mapPointListToLineList } from '@stayradiated/pomo-core'

const load = (async () => {
  const doc = await getDoc()
  if (doc instanceof Error) {
    throw doc
  }

  const timeZone = getUserTimeZone({ doc })
  const since = startOfWeekWithTimeZone({ instant: Date.now(), timeZone }).getTime()

  const streamList = retrieveStreamList({ doc })

  const pointList = retrievePointList({
    doc,
    since,
    where: {
      streamId: 'ab78502d-6bf9-46b7-8d02-14acd02f275a'
    }
  })

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    throw lineList
  }

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
    streamDurationMap,
    streamStartedAtMap,
    streamStoppedAtMap
  }
}) satisfies PageServerLoad;

export { load }
