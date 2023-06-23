import type { Doc } from './types.js'

type GetStreamIdByNameOptions = {
  doc: Doc
  name: string
}

const getStreamIdByName = (
  options: GetStreamIdByNameOptions,
): string | undefined => {
  const { doc, name } = options

  const streamMap = doc.getMap('stream')

  for (const stream of streamMap.values()) {
    if (stream.get('name') === name) {
      return stream.get('id')
    }
  }

  return undefined
}

export { getStreamIdByName }
