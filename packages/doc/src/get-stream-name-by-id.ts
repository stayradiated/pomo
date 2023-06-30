import type { Doc } from './types.js'

type GetStreamNameByIdOptions = {
  doc: Doc
  streamId: string
}

const getStreamNameById = (
  options: GetStreamNameByIdOptions,
): string | undefined => {
  const { doc, streamId } = options

  const streamMap = doc.getMap('stream')

  const stream = streamMap.get(streamId)
  if (!stream) {
    return undefined
  }

  return stream.get('name')
}

export { getStreamNameById }
