import { CliCommand } from 'cilly'
import { getDoc } from '#src/lib/doc.js'
import { listStreams } from './list-streams.js'

const listCmd = new CliCommand('list')
  .withDescription('List all streams')
  .withHandler(async () => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    listStreams({ doc })
  })

export { listCmd }
