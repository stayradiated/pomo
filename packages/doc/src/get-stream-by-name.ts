import { MultipleFoundError, NotFoundError } from './error.js'
import type { Doc, Stream } from './types.js'

type GetStreamByNameOptions = {
  doc: Doc
  name: string
}

const getStreamByName = (options: GetStreamByNameOptions): Stream | Error => {
  const { doc, name } = options

  const streamMap = doc.getMap('stream')

  const streamWithName = Array.from(streamMap.values()).filter((stream) => {
    return stream.get('name') === name
  })

  const stream = streamWithName[0]

  if (!stream) {
    return new NotFoundError(`No stream with name ${name}`)
  }

  if (streamWithName.length > 1) {
    return new MultipleFoundError(`Multiple streams with name ${name}`)
  }

  return stream.toJSON() as Stream
}

export { getStreamByName }
