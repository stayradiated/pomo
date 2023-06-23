import type { Doc } from './types.js'

type GetPointStartedAtByRefOptions = {
  doc: Doc
  ref: string
}

const getPointStartedAtByRef = (
  options: GetPointStartedAtByRefOptions,
): number | undefined => {
  const { doc, ref } = options

  const pointMap = doc.getMap('point')

  for (const key of pointMap.keys()) {
    if (key.startsWith(ref)) {
      const row = pointMap.get(key)
      if (row) {
        return row.get('startedAt')
      }
    }
  }

  return undefined
}

export { getPointStartedAtByRef }
