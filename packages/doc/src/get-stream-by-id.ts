import { NotFoundError } from './error.js'
import type { Doc, Stream } from './types.js'

type GetStreamByIdOptions = {
  doc: Doc
  streamId: string
}

const getStreamById = (options: GetStreamByIdOptions): Stream | Error => {
  const { doc, streamId } = options

  const streamMap = doc.getMap('stream')

  const stream = streamMap.get(streamId)
  if (!stream) {
    return new NotFoundError(`No stream with id ${streamId}`)
  }

  return stream.toJSON() as Stream
}

export { getStreamById }
