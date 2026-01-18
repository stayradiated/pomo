import type { Doc, Stream } from './types.js'

type GetOptions = {
  doc: Doc
}

const getStreamRecord = (options: GetOptions): Record<string, Stream> => {
  const { doc } = options

  const streamMap = doc.getMap('stream')
  const streamRecord = streamMap.toJSON() as Record<string, Stream>

  return streamRecord
}

export { getStreamRecord }
