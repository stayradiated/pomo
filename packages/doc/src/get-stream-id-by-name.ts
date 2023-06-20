import type { AutomergeDoc } from './types.js'

type GetStreamIdByNameOptions = {
  doc: AutomergeDoc
  name: string
}

const getStreamIdByName = async (
  options: GetStreamIdByNameOptions,
): Promise<string | Error> => {
  const { doc, name } = options

  for (const stream of Object.values(doc.stream)) {
    if (stream.name === name) {
      return stream.id
    }
  }

  return new Error(`Stream not found: ${name}`)
}

export { getStreamIdByName }
