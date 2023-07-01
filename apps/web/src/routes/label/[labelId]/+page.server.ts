import { error, redirect } from '@sveltejs/kit'
import { getDoc, saveDoc } from '$lib/doc.js'
import {
  getLabelRecord,
  getStreamRecord,
  updateLabel,
} from '@stayradiated/pomo-doc'
import type { PageServerLoad, Actions } from './$types'
import { zfd } from 'zod-form-data'

const load = (async ({ params }) => {
  const { labelId } = params

  const doc = await getDoc()
  if (doc instanceof Error) {
    throw error(500, doc.message)
  }

  const streamRecord = getStreamRecord({ doc })
  const labelRecord = getLabelRecord({ doc })

  const label = labelRecord[labelId]
  const stream = streamRecord[label.streamId]

  return {
    stream,
    label,
  }
}) satisfies PageServerLoad

const $schema = zfd.formData({
  name: zfd.text(),
  color: zfd.text(),
})

const actions = {
  default: async ({ params, request }) => {
    const { labelId } = params

    const formData = $schema.parse(await request.formData())
    const { name, color } = formData

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw error(500, doc.message)
    }

    const result = updateLabel({ doc, labelId, name, color })
    if (result instanceof Error) {
      throw error(500, result.message)
    }

    await saveDoc()

    throw redirect(302, '/label')
  },
} satisfies Actions

export { load, actions }
