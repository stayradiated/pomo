import type { AutomergeDoc } from './types.js'

type GetPointStartedAtByRefOptions = {
  doc: AutomergeDoc
  ref: string
}

const getPointStartedAtByRef = (
  options: GetPointStartedAtByRefOptions,
): number | undefined => {
  const { doc, ref } = options

  for (const key of Object.keys(doc.point)) {
    if (key.startsWith(ref)) {
      const row = doc.point[key]
      if (row) {
        return row.startedAt
      }
    }
  }

  return undefined
}

export { getPointStartedAtByRef }
