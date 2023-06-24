import type { Doc, Label } from './types.js'

type GetOptions = {
  doc: Doc
}

const getLabelList = (options: GetOptions): Label[] => {
  const { doc } = options

  const labelMap = doc.getMap('label')
  const labelList = Object.values(labelMap.toJSON()) as Label[]

  return labelList
}

export { getLabelList }
