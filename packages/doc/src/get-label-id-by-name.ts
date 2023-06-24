import type { Doc } from './types.js'

type GetLabelIdByNameOptions = {
  doc: Doc
  name: string
  streamId: string
}

const getLabelIdByName = (
  options: GetLabelIdByNameOptions,
): string | undefined => {
  const { doc, name, streamId } = options

  const labelMap = doc.getMap('label')

  for (const label of labelMap.values()) {
    if (label.get('streamId') === streamId && label.get('name') === name) {
      return label.get('id')
    }
  }

  return undefined
}

export { getLabelIdByName }
