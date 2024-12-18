import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import {
  getLabelRecord,
  getStreamList,
  getUserTimeZone,
} from '@stayradiated/pomo-doc'
import { getDoc } from '$lib/doc.js'
import { getCurrentPointMap, groupLabelByStream } from '@stayradiated/pomo-core'
import { formatInTimeZone } from 'date-fns-tz'

const load = (async () => {
  const currentTime = Date.now()
  const doc = await getDoc()
  if (doc instanceof Error) {
    throw error(500, doc.message)
  }

  const streamList = getStreamList({ doc })
  const streamIdList = streamList.map((stream) => stream.id)
  const currentPointMap = getCurrentPointMap({ doc, streamIdList, currentTime })

  const timeZone = getUserTimeZone({ doc })
  const startedAtLocal = formatInTimeZone(
    Date.now(),
    timeZone,
    "yyyy-MM-dd'T'HH:mm",
  )

  const labelRecord = getLabelRecord({ doc })
  const streamLabelRecord = groupLabelByStream(labelRecord)

  return {
    doc,
    startedAtLocal,
    streamList,
    currentPointMap,
    streamLabelRecord,
    timeZone,
  }
}) satisfies PageLoad

export { load }
