import type { Doc } from '@stayradiated/pomo-doc'
import { updateLabel, transact } from '@stayradiated/pomo-doc'

type RenameLabelOptions = {
  doc: Doc
  labelId: string
  name: string
}

const renameLabel = (options: RenameLabelOptions): void | Error => {
  const { doc, labelId, name } = options

  const result = transact(doc, () => updateLabel({ doc, labelId, name }))
  if (result instanceof Error) {
    return result
  }

  return undefined
}

export { renameLabel }
