import type { Doc } from './types.js'

type GetStreamIdByRefOptions = {
  doc: Doc
  ref: string
}

const getStreamIdByRef = (
  options: GetStreamIdByRefOptions,
): string | undefined => {
  const { doc, ref } = options

  const streamMap = doc.getMap('stream')

  for (const key of streamMap.keys()) {
    if (key.startsWith(ref)) {
      const row = streamMap.get(key)
      if (row) {
        return row.get('id')
      }
    }
  }

  return undefined
}

export { getStreamIdByRef }
