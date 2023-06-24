import type { Doc, Label } from './types.js'

type GetOptions = {
  doc: Doc
}

const getLabelRecord = (options: GetOptions): Record<string, Label> => {
  const { doc } = options

  const labelMap = doc.getMap('label')
  const labelRecord = labelMap.toJSON() as Record<string, Label>

  return labelRecord
}

export { getLabelRecord }
