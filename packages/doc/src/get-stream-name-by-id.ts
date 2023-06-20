import type { AutomergeDoc } from './types.js'

type GetStreamNameByIdOptions = {
  doc: AutomergeDoc
  id: string
}

const getStreamNameById = async (
  options: GetStreamNameByIdOptions,
): Promise<string | Error> => {
  const { doc, id } = options
  const stream = doc.stream[id]
  if (!stream) {
    return new Error(`Stream not found: ${id}`)
  }

  return stream.name
}

export { getStreamNameById }
