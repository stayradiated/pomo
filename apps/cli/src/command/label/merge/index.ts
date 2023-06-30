import { CliCommand } from 'cilly'
import {
  getLabelIdByRef,
  getLabelById,
  mergeLabels,
} from '@stayradiated/pomo-doc'
import { confirmDialog } from './confirm-dialog.js'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const mergeCmd = new CliCommand('merge')
  .withDescription('Merge two labels')
  .withArguments(
    {
      name: 'src',
      description: 'The label ref to merge from',
      required: true,
    },
    {
      name: 'dest',
      description: 'The label ref to merge into',
      required: true,
    },
  )
  .withHandler(async (args) => {
    const { src: srcRef, dest: destRef } = args

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    if (srcRef === destRef) {
      throw new Error('src and dest must be different')
    }

    const srcLabelId = getLabelIdByRef({ doc, ref: srcRef })
    if (!srcLabelId) {
      throw new Error(`Label not found: ${srcRef}`)
    }

    const srcLabel = getLabelById({ doc, labelId: srcLabelId })
    if (!srcLabel) {
      throw new Error(`Label not found: ${srcLabelId}`)
    }

    const destLabelId = getLabelIdByRef({ doc, ref: destRef })
    if (!destLabelId) {
      throw new Error(`Label not found: ${destRef}`)
    }

    const destLabel = getLabelById({ doc, labelId: destLabelId })
    if (!destLabel) {
      throw new Error(`Label not found: ${destLabelId}`)
    }

    if (srcLabel.streamId !== destLabel.streamId) {
      throw new Error(`Labels must be in the same stream`)
    }

    const confirm = await confirmDialog({
      srcLabel,
      destLabel,
    })
    if (!confirm) {
      return
    }

    const result = mergeLabels({
      doc,
      streamId: srcLabel.streamId,
      srcLabelId,
      destLabelId,
    })
    if (result instanceof Error) {
      throw result
    }

    await saveDoc()
  })

export { mergeCmd }
