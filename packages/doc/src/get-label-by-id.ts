import type { Doc, Label } from './types.js'
import { NotFoundError } from './error.js'

type GetLabelByIdOptions = {
  doc: Doc
  labelId: string
}

const getLabelById = (options: GetLabelByIdOptions): Label | Error => {
  const { doc, labelId } = options

  const labelMap = doc.getMap('label')
  const label = labelMap.get(labelId)
  if (!label) {
    return new NotFoundError(`No label with id ${labelId}`)
  }

  return label.toJSON() as Label
}

export { getLabelById }
