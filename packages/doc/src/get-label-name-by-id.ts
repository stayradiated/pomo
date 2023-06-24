import type { Doc } from './types.js'

type GetLabelNameByIdOptions = {
  doc: Doc
  id: string
}

const getLabelNameById = (
  options: GetLabelNameByIdOptions,
): string | undefined => {
  const { doc, id } = options

  const labelMap = doc.getMap('label')

  const label = labelMap.get(id)
  if (!label) {
    return undefined
  }

  return label.get('name')
}

export { getLabelNameById }
