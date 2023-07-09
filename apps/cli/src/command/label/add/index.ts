import { CliCommand } from 'cilly'
import { upsertLabel, getStreamByName, transact } from '@stayradiated/pomo-doc'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const addCmd = new CliCommand('add')
  .withArguments(
    {
      name: 'stream',
      description: 'Name of the stream',
      required: true,
    },
    {
      name: 'name',
      description: 'Label name',
      required: true,
    },
  )
  .withHandler(async (args) => {
    const streamName = args['stream']
    const name = args['name']

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const stream = getStreamByName({ doc, name: streamName })
    if (stream instanceof Error) {
      throw stream
    }

    const streamId = stream.id

    const labelId = transact(doc, () => upsertLabel({ doc, streamId, name }))
    if (labelId instanceof Error) {
      throw labelId
    }

    console.log(`Label "${name}" added with id "${labelId}"`)

    await saveDoc()
  })

export { addCmd }
