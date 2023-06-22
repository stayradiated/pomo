import type { AutomergeDoc } from './types.js'

type GetStreamNameByIdOptions = {
  doc: AutomergeDoc
  id: string
}

const getStreamNameById = (
  options: GetStreamNameByIdOptions,
): string | undefined => {
  const { doc, id } = options
  const stream = doc.stream[id]
  if (!stream) {
    return undefined
  }

  return stream.name
}

export { getStreamNameById }
