import { error } from '@sveltejs/kit'
import { getDoc, saveDoc } from '$lib/doc.js'
import {
  getLabelList,
  getStreamList,
  deleteLabels,
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
  const labelList = getLabelList({ doc })

  const streamLabelListMap = new Map<string, Label[]>()
  for (const label of labelList) {
    const streamId = label.streamId

    if (!streamLabelListMap.has(streamId)) {
      streamLabelListMap.set(streamId, [])
    }

    const streamLabelList = streamLabelListMap.get(streamId)!
    streamLabelList.push(label)
  }

  for (const labelList of streamLabelListMap.values()) {
    labelList.sort((a, b) => a.name.localeCompare(b.name))
  }

  return {
    streamList,
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
        const result = deleteLabels({ doc, streamId, labelIdList })
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
