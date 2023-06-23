import type { Doc } from './types.js'

type GetStreamNameByIdOptions = {
  doc: Doc
  id: string
}

const getStreamNameById = (
  options: GetStreamNameByIdOptions,
): string | undefined => {
  const { doc, id } = options

  const streamMap = doc.getMap('stream')

  const stream = streamMap.get(id)
  if (!stream) {
    return undefined
  }

  return stream.get('name')
}

export { getStreamNameById }
