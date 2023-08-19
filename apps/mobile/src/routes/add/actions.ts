import { error } from '@sveltejs/kit'
import {
  getStreamList,
  upsertPoint,
  updatePoint,
  transact,
  getUserTimeZone,
  upsertLabel,
} from '@stayradiated/pomo-doc'
import { getDoc, saveDoc } from '$lib/doc.js'
import { redirect } from '@sveltejs/kit'
import { getCurrentPoints } from '$lib/get-current-points'
import { toDate } from 'date-fns-tz'

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
            const labelId = transact(doc, () =>
              upsertLabel({
                doc,
                name: labelInput.name,
                streamId,
              }),
            )
            if (labelId instanceof Error) {
              throw error(500, labelId.message)
            }
            return labelId
          }
          default: {
            throw error(
              400,
              `Unknown label type: ${JSON.stringify(labelInput)}`,
            )
          }
        }
      })

      const value = valueRaw.replace(/\r/g, '')
      const hasDifferentValue = currentPoint?.value !== value
      const hasDifferentLabel =
        JSON.stringify(currentPoint?.labelIdList) !==
        JSON.stringify(labelIdList)

      if (hasDifferentValue || hasDifferentLabel) {
        const result = transact(doc, () => {
          return currentPoint?.startedAt === startedAt
            ? updatePoint({
                doc,
                pointId: currentPoint.id,
                value,
                labelIdList,
              })
            : upsertPoint({
                doc,
                streamId,
                value,
                labelIdList,
                startedAt,
              })
        })
        if (result instanceof Error) {
          throw error(500, result.message)
        }
      }
    }

    await saveDoc()

    throw redirect(303, '/')
  },
}

export { actions }
