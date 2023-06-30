import { CliCommand } from 'cilly'
import { getStreamIdByName } from '@stayradiated/pomo-doc'
import { listLabels } from './list-labels.js'
import { getDoc } from '#src/lib/doc.js'

const listCmd = new CliCommand('list')
  .withDescription('List labels')
  .withOptions({
    name: ['-s', '--stream'],
    description: 'Only list labels for a single stream',
    args: [
      {
        name: 'name',
        description: 'Name of the stream to list labels for',
        required: true,
      },
    ],
  })
  .withHandler(async (_args, options) => {
    const { stream: streamName } = options

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const streamId = streamName
      ? getStreamIdByName({ doc, name: streamName })
      : undefined
    if (streamName && !streamId) {
      throw new Error(`Stream not found: ${streamName}`)
    }

    const result = listLabels({ doc, streamId })

    if (result instanceof Error) {
      throw result
    }
  })

export { listCmd }
