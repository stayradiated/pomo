import { error } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import {
  getLabelRecord,
  getStreamList,
  upsertPoint,
  updatePoint,
  getUserTimeZone,
  upsertLabel,
} from '@stayradiated/pomo-doc'
import { getDoc, saveDoc } from '$lib/doc.js'
import { redirect } from '@sveltejs/kit'
import { getCurrentPoints } from '$lib/get-current-points'
import { zfd } from 'zod-form-data'
import { z } from 'zod'
import { toDate, formatInTimeZone } from 'date-fns-tz'
import type { Label } from '@stayradiated/pomo-core'

// TODO: move to core
type StreamLabelRecord = Record<string, Record<string, Label>>
const groupLabelByStream = (
  labelRecord: Record<string, Label>,
): StreamLabelRecord => {
  const byStream: StreamLabelRecord = {}
  for (const label of Object.values(labelRecord)) {
    const { streamId } = label
    if (!byStream[streamId]) {
      byStream[streamId] = {}
    }
    byStream[streamId][label.id] = label
  }
  return byStream
}

const load = (async () => {
  const currentTime = Date.now()
  const doc = await getDoc()
  if (doc instanceof Error) {
    throw error(500, doc.message)
  }

  const streamList = getStreamList({ doc })
  const currentPoints = getCurrentPoints({ doc, streamList, currentTime })

  const timeZone = getUserTimeZone({ doc })
  const startedAtLocal = formatInTimeZone(
    Date.now(),
    timeZone,
    'yyyy-MM-dd HH:mm',
  )

  const labelRecord = getLabelRecord({ doc })
  const streamLabelRecord = groupLabelByStream(labelRecord)

  return {
    startedAtLocal,
    streamList,
    currentPoints,
    streamLabelRecord,
  }
}) satisfies PageServerLoad

const $Schema = zfd.formData({
  startedAtLocal: zfd.text(),
  stream: zfd.repeatable(
    z.array(
      z.object({
        id: zfd.text(),
        value: zfd.text(z.string().optional().default('')),
        label: zfd.repeatable(
          z.array(
            z.discriminatedUnion('type', [
              z.object({
                type: z.literal('connect'),
                id: zfd.text(),
              }),
              z.object({
                type: z.literal('create'),
                name: zfd.text(),
              }),
            ]),
          ),
        ),
      }),
    ),
  ),
})

const actions = {
  async default({ request }) {
    const formData = $Schema.parse(await request.formData())
    const { startedAtLocal, stream: streamValueList } = formData

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw error(500, doc.message)
    }

    const timeZone = getUserTimeZone({ doc })
    const startedAt = toDate(startedAtLocal, { timeZone }).getTime()

    const streamList = getStreamList({ doc })
    const currentPoints = getCurrentPoints({
      doc,
      streamList,
      currentTime: startedAt,
    })
    for (const streamValue of streamValueList) {
      const { id: streamId, value: valueRaw, label: labelRaw } = streamValue

      const currentPoint = currentPoints.get(streamId)

      const labelIdList: string[] = labelRaw.map((labelInput) => {
        switch (labelInput.type) {
          case 'connect': {
            return labelInput.id
          }
          case 'create': {
            const labelId = upsertLabel({
              doc,
              name: labelInput.name,
              streamId,
            })
            return labelId
          }
          default: {
            throw new Error(`Unknown label type: ${JSON.stringify(labelInput)}`)
          }
        }
      })

      const value = valueRaw.replace(/\r/g, '')
      const hasDifferentValue = currentPoint?.value !== value
      const hasDifferentLabel =
        JSON.stringify(currentPoint?.labelIdList) !==
        JSON.stringify(labelIdList)

      if (hasDifferentValue || hasDifferentLabel) {
        if (currentPoint?.startedAt === startedAt) {
          updatePoint({
            doc,
            pointId: currentPoint.id,
            value,
            labelIdList,
          })
        } else {
          upsertPoint({
            doc,
            streamId,
            value,
            labelIdList,
            startedAt,
          })
        }
      }
    }

    await saveDoc()

    throw redirect(303, '/')
  },
} satisfies Actions

export { load, actions }
