import type { Doc, Label } from './types.js'

type GetLabelByIdOptions = {
  doc: Doc
  labelId: string
}

const getLabelById = (options: GetLabelByIdOptions): Label | undefined => {
  const { doc, labelId } = options

  const labelMap = doc.getMap('label')
  const label = labelMap.get(labelId)
  if (!label) {
    return undefined
  }

  return label.toJSON() as Label
}

export { getLabelById }
