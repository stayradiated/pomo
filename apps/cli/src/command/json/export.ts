import {
  getLabelRecord,
  getPointRecord,
  getStreamRecord,
  getUserRecord,
} from '@stayradiated/pomo-doc'
import type { JsonDoc } from '@stayradiated/pomo-doc'
import { getDoc } from '#src/lib/doc.js'

const exportAsJson = async (): Promise<undefined | Error> => {
  const doc = await getDoc()
  if (doc instanceof Error) {
    return doc
  }

  const userRecord = getUserRecord({ doc })
  const streamRecord = getStreamRecord({ doc })
  const pointRecord = getPointRecord({ doc })
  const labelRecord = getLabelRecord({ doc })

  const jsonDoc: JsonDoc = {
    user: userRecord,
    stream: streamRecord,
    point: pointRecord,
    label: labelRecord,
  }

  console.log(JSON.stringify(jsonDoc))
}

export { exportAsJson }
