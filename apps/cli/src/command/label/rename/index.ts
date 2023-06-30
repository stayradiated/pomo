import { CliCommand } from 'cilly'
import {
  getLabelById,
  getLabelIdByRef,
  getLabelIdByName,
} from '@stayradiated/pomo-doc'
import { renameLabel } from './rename-label.js'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const renameCmd = new CliCommand('rename')
  .withDescription('Rename a label')
  .withArguments(
    {
      name: 'ref',
      description: 'The label ref to rename',
      required: true,
    },
    {
      name: 'name',
      description: 'The new name for the label',
      required: true,
    },
  )
  .withHandler(async (args) => {
    const { ref, name } = args

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const labelId = getLabelIdByRef({ doc, ref })
    if (!labelId) {
      throw new Error(`Label not found: ${ref}`)
    }

    const label = getLabelById({ doc, labelId })
    if (!label) {
      throw new Error(`Label not found: ${labelId}`)
    }

    const existingLabelWithName = getLabelIdByName({
      doc,
      name,
      streamId: label.streamId,
    })
    if (existingLabelWithName) {
      throw new Error(`Label already exists with name: ${name}`)
    }

    const result = renameLabel({ doc, labelId, name })
    if (result instanceof Error) {
      throw result
    }

    await saveDoc()
  })

export { renameCmd }
