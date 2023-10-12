import { CliCommand } from 'cilly'
import {
  getStreamByName,
  getLabelByName,
  getLabelByRef,
  mergeLabels,
  transact,
} from '@stayradiated/pomo-doc'
import { confirmDialog } from './confirm-dialog.js'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const mergeCmd = new CliCommand('merge')
  .withDescription('Merge two labels')
  .withOptions({
    name: ['-r', '--as-ref'],
    description: 'Use refs instead of names',
  })
  .withArguments(
    {
      name: 'stream',
      description: 'The stream name',
      required: true,
    },
    {
      name: 'src',
      description: 'The label name to merge from',
      required: true,
    },
    {
      name: 'dest',
      description: 'The label name to merge into',
      required: true,
    },
  )
  .withHandler(async (args, options) => {
    const { stream: streamName, src: srcName, dest: destName } = args
    const { asRef } = options

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    if (srcName === destName) {
      throw new Error('src and dest must be different')
    }

    const stream = getStreamByName({ doc, name: streamName })
    if (stream instanceof Error) {
      throw stream
    }

    const srcLabel = asRef
      ? getLabelByRef({ doc, ref: srcName })
      : getLabelByName({ doc, streamId: stream.id, name: srcName })
    if (srcLabel instanceof Error) {
      throw srcLabel
    }

    const destLabel = asRef
      ? getLabelByRef({ doc, ref: destName })
      : getLabelByName({ doc, streamId: stream.id, name: destName })
    if (destLabel instanceof Error) {
      throw destLabel
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

    const result = transact(doc, () =>
      mergeLabels({
        doc,
        streamId: srcLabel.streamId,
        srcLabelId: srcLabel.id,
        destLabelId: destLabel.id,
      }),
    )
    if (result instanceof Error) {
      throw result
    }

    await saveDoc()
  })

export { mergeCmd }
