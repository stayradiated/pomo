import { CliCommand } from 'cilly'
import { upsertStream } from '@stayradiated/pomo-doc'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const addCmd = new CliCommand('add')
  .withArguments({
    name: 'name',
    description: 'Stream name',
    required: true,
  })
  .withHandler(async (args) => {
    const name = args['name']

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const streamId = upsertStream({ doc, name })

    console.log(`Stream "${name}" added with id "${streamId}"`)

    await saveDoc()
  })

export { addCmd }
