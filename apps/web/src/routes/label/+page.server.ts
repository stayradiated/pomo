import { error } from '@sveltejs/kit'
import { getDoc, saveDoc } from '$lib/doc.js'
import {
  getLabelRecord,
  getStreamList,
  deleteLabels,
  transact,
} from '@stayradiated/pomo-doc'
import type { Label } from '@stayradiated/pomo-doc'
import type { PageServerLoad, Actions } from './$types'
import { zfd } from 'zod-form-data'
import { z } from 'zod'

const load = (async () => {
  const doc = await getDoc()
  if (doc instanceof Error) {
    throw error(500, doc.message)
  }

  const streamList = getStreamList({ doc })
  const labelRecord = getLabelRecord({ doc })
  const labelList = Object.values(labelRecord)

  const streamLabelListMap = new Map<string, Map<string | null, Label[]>>()
  for (const label of labelList) {
    const streamId = label.streamId

    if (!streamLabelListMap.has(streamId)) {
      streamLabelListMap.set(streamId, new Map())
    }
    const streamLabelMap = streamLabelListMap.get(streamId)!

    if (!streamLabelMap.has(label.parentId)) {
      streamLabelMap.set(label.parentId, [])
    }
    const labelList = streamLabelMap.get(label.parentId)!

    labelList.push(label)
  }

  for (const streamLabelMap of streamLabelListMap.values()) {
    for (const labelList of streamLabelMap.values()) {
      labelList.sort((a, b) => a.name.localeCompare(b.name))
    }
  }

  return {
    streamList,
    labelRecord,
    streamLabelListMap,
  }
}) satisfies PageServerLoad

const $schema = zfd.formData({
  'action:delete': zfd.text(),
  stream: zfd.text(),
  label: zfd.repeatable(z.array(zfd.text())),
})

const actions = {
  default: async ({ request }) => {
    const formData = $schema.parse(await request.formData())
    const { label: labelIdList, stream: streamId } = formData
    const action = formData['action:delete'] ? 'delete' : undefined

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw error(500, doc.message)
    }

    switch (action) {
      case 'delete': {
        const result = transact(doc, () =>
          deleteLabels({ doc, streamId, labelIdList }),
        )
        if (result instanceof Error) {
          throw error(500, result.message)
        }
        break
      }
      default: {
        throw error(400, 'Invalid action')
      }
    }

    await saveDoc()

    return {}
  },
} satisfies Actions

export { load, actions }
