import { error, redirect } from '@sveltejs/kit'
import { getDoc, saveDoc } from '$lib/doc.js'
import {
  getLabelRecord,
  getStreamRecord,
  updateLabel,
  transact,
} from '@stayradiated/pomo-doc'
import type { PageServerLoad, Actions } from './$types'
import { zfd } from 'zod-form-data'
import { z } from 'zod'

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
  icon: zfd.text(z.string().optional()),
  color: zfd.text(),
})

const actions = {
  default: async ({ params, request }) => {
    const { labelId } = params

    const formData = $schema.parse(await request.formData())
    const { name, icon, color } = formData

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw error(500, doc.message)
    }

    const result = transact(doc, () =>
      updateLabel({
        doc,
        labelId,
        name,
        icon: icon || null,
        color,
      }),
    )
    if (result instanceof Error) {
      throw error(500, result.message)
    }

    await saveDoc()

    throw redirect(302, '/label')
  },
} satisfies Actions

export { load, actions }
