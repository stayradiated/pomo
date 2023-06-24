import {
  getUserRecord,
  getStreamRecord,
  getPointRecord,
} from '@stayradiated/pomo-doc'
import type { JsonDoc } from './schema.js'
import { getDoc } from '#src/lib/doc.js'

const exportAsJson = async (): Promise<void | Error> => {
  const doc = await getDoc()
  if (doc instanceof Error) {
    return doc
  }

  const userRecord = getUserRecord({ doc })
  const streamRecord = getStreamRecord({ doc })
  const pointRecord = getPointRecord({ doc })

  const jsonDoc: JsonDoc = {
    user: userRecord,
    stream: streamRecord,
    point: pointRecord,
  }

  console.log(JSON.stringify(jsonDoc))
}

export { exportAsJson }
