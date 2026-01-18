import {
  NotFoundError,
  getLabelByName,
  getStreamByName,
} from '@stayradiated/pomo-doc'
import { CliCommand } from 'cilly'
import { getDoc, saveDoc } from '#src/lib/doc.js'
import { renameLabel } from './rename-label.js'

const renameCmd = new CliCommand('rename')
  .withDescription('Rename a label')
  .withArguments(
    {
      name: 'stream',
      description: 'The name of the stream',
      required: true,
    },
    {
      name: 'label',
      description: 'The curren tname of label',
      required: true,
    },
    {
      name: 'name',
      description: 'The new name for the label',
      required: true,
    },
  )
  .withHandler(async (args) => {
    const { label: labelName, name, stream: streamName } = args

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const stream = getStreamByName({ doc, name: streamName })
    if (stream instanceof Error) {
      throw stream
    }

    const label = getLabelByName({ doc, streamId: stream.id, name: labelName })
    if (label instanceof Error) {
      throw label
    }

    const existingLabelWithName = getLabelByName({
      doc,
      name,
      streamId: label.streamId,
    })
    if (!(existingLabelWithName instanceof NotFoundError)) {
      throw new TypeError(`Label already exists with name: ${name}`)
    }

    const result = renameLabel({ doc, labelId: label.id, name })
    if (result instanceof Error) {
      throw result
    }

    await saveDoc()
  })

export { renameCmd }
