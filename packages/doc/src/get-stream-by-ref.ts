import type { Doc, Stream } from './types.js'
import { NotFoundError, MultipleFoundError } from './error.js'

type GetStreamByRefOptions = {
  doc: Doc
  ref: string
}

const getStreamByRef = (options: GetStreamByRefOptions): Stream | Error => {
  const { doc, ref } = options

  const streamMap = doc.getMap('stream')

  const streamIdList = Array.from(streamMap.keys()).filter((key) => {
    return key.startsWith(ref)
  })

  const streamId = streamIdList[0]
  const row = streamId && streamMap.get(streamId)
  if (!row) {
    return new NotFoundError(`No stream with ref ${ref}`)
  }

  if (streamIdList.length > 1) {
    return new MultipleFoundError(`Multiple streams with ref ${ref}`)
  }

  return row.toJSON() as Stream
}

export { getStreamByRef }
