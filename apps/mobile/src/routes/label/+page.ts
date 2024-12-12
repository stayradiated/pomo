import { error } from '@sveltejs/kit'
import { getDoc } from '$lib/doc.js'
import { getLabelRecord, getStreamList } from '@stayradiated/pomo-doc'
import type { Label } from '@stayradiated/pomo-doc'
import type { PageLoad } from './$types'

const load = (async ({ url }) => {
  const doc = await getDoc()
  if (doc instanceof Error) {
    throw error(500, doc.message)
  }

  const streamList = getStreamList({ doc })
  const labelRecord = getLabelRecord({ doc })
  const labelList = Object.values(labelRecord)

  const streamId = url.searchParams.get('stream') ?? streamList[0].id
  const stream = streamList.find((stream) => stream.id === streamId)

  if (!stream) {
    throw error(404, 'Stream not found')
  }

  const streamLabelMap = new Map<string | null, Label[]>()
  for (const label of labelList) {
    if (label.streamId !== streamId) {
      continue
    }

    if (!streamLabelMap.has(label.parentId)) {
      streamLabelMap.set(label.parentId, [])
    }
    const labelList = streamLabelMap.get(label.parentId)!

    labelList.push(label)
  }

  for (const labelList of streamLabelMap.values()) {
    labelList.sort((a, b) => a.name.localeCompare(b.name))
  }

  return {
    doc,
    stream,
    streamList,
    labelRecord,
    streamLabelMap,
  }
}) satisfies PageLoad

export { load }
