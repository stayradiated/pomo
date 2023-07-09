import { CliCommand } from 'cilly'
import {
  getStreamByName,
  getLabelByName,
  updateLabelStream,
  transact,
} from '@stayradiated/pomo-doc'
import { confirmDialog } from './confirm-dialog.js'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const moveToStreamCmd = new CliCommand('move-to-stream')
  .withDescription('Move a label to a different stream')
  .withArguments(
    {
      name: 'label',
      description: 'The name of the label to move',
      required: true,
    },
    {
      name: 'src',
      description: 'The name of the stream to move the label from',
      required: true,
    },
    {
      name: 'dest',
      description: 'The name of the stream to move the label to',
      required: true,
    },
  )
  .withHandler(async (args) => {
    const labelName = args['label']
    const srcStreamName = args['src']
    const destStreamName = args['dest']

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const srcStream = getStreamByName({ doc, name: srcStreamName })
    if (srcStream instanceof Error) {
      throw srcStream
    }

    const label = getLabelByName({
      doc,
      streamId: srcStream.id,
      name: labelName,
    })
    if (label instanceof Error) {
      throw label
    }

    const destStream = getStreamByName({ doc, name: destStreamName })
    if (destStream instanceof Error) {
      throw destStream
    }

    const confirm = await confirmDialog({
      label,
      srcStream,
      destStream,
    })
    if (!confirm) {
      return
    }

    const result = transact(doc, () =>
      updateLabelStream({ doc, labelId: label.id, streamId: destStream.id }),
    )
    if (result instanceof Error) {
      throw result
    }

    await saveDoc()
  })

export { moveToStreamCmd }
