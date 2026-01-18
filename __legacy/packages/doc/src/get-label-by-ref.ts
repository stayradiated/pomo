import { MultipleFoundError, NotFoundError } from './error.js'
import type { Doc, Label } from './types.js'

type GetLabelByRefOptions = {
  doc: Doc
  ref: string
}

const getLabelByRef = (options: GetLabelByRefOptions): Label | Error => {
  const { doc, ref } = options

  const labelMap = doc.getMap('label')

  const labelIdList = Array.from(labelMap.keys()).filter((labelId) => {
    return labelId.startsWith(ref)
  })

  const labelId = labelIdList[0]
  const row = labelId && labelMap.get(labelId)
  if (!row) {
    return new NotFoundError(`No label with ref ${ref}`)
  }

  if (labelIdList.length > 1) {
    return new MultipleFoundError(`Multiple labels with ref ${ref}`)
  }

  return row.toJSON() as Label
}

export { getLabelByRef }
