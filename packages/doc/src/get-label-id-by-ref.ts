import type { Doc } from './types.js'

type GetLabelIdByRefOptions = {
  doc: Doc
  ref: string
}

const getLabelIdByRef = (
  options: GetLabelIdByRefOptions,
): string | undefined => {
  const { doc, ref } = options

  const labelMap = doc.getMap('label')

  for (const key of labelMap.keys()) {
    if (key.startsWith(ref)) {
      const row = labelMap.get(key)
      if (row) {
        return row.get('id')
      }
    }
  }

  return undefined
}

export { getLabelIdByRef }
