import type { Doc } from './types.js'

type GetLabelNameByIdOptions = {
  doc: Doc
  labelId: string
}

const getLabelNameById = (
  options: GetLabelNameByIdOptions,
): string | undefined => {
  const { doc, labelId } = options

  const labelMap = doc.getMap('label')

  const label = labelMap.get(labelId)
  if (!label) {
    return undefined
  }

  return label.get('name')
}

export { getLabelNameById }
