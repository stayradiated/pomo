import { MultipleFoundError, NotFoundError } from './error.js'
import type { Doc, Label } from './types.js'

type GetLabelByNameOptions = {
  doc: Doc
  name: string
  streamId: string
}

const getLabelByName = (options: GetLabelByNameOptions): Label | Error => {
  const { doc, name, streamId } = options

  const labelMap = doc.getMap('label')

  const labelWithName = Array.from(labelMap.values()).filter((label) => {
    return label.get('name') === name && label.get('streamId') === streamId
  })

  const label = labelWithName[0]

  if (!label) {
    return new NotFoundError(`No label with name ${name}`)
  }

  if (labelWithName.length > 1) {
    return new MultipleFoundError(`Multiple labels with name ${name}`)
  }

  return label.toJSON() as Label
}

export { getLabelByName }
