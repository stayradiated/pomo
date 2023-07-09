import { CliCommand } from 'cilly'
import { getStreamByName } from '@stayradiated/pomo-doc'
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

    let whereStreamId: string | undefined
    if (streamName) {
      const stream = getStreamByName({ doc, name: streamName })
      if (stream instanceof Error) {
        throw stream
      }

      whereStreamId = stream.id
    }

    const result = listLabels({ doc, streamId: whereStreamId })

    if (result instanceof Error) {
      throw result
    }
  })

export { listCmd }
