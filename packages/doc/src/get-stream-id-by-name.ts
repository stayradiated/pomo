import type { AutomergeDoc } from './types.js'

type GetStreamIdByNameOptions = {
  doc: AutomergeDoc
  name: string
}

const getStreamIdByName = (
  options: GetStreamIdByNameOptions,
): string | undefined => {
  const { doc, name } = options

  for (const stream of Object.values(doc.stream)) {
    if (stream.name === name) {
      return stream.id
    }
  }

  return undefined
}

export { getStreamIdByName }
