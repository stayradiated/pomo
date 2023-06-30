import { CliCommand } from 'cilly'
import { listStreams } from './list-streams.js'
import { getDoc } from '#src/lib/doc.js'

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
