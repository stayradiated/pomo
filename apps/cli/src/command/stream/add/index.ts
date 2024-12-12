import { transact, upsertStream } from '@stayradiated/pomo-doc'
import { CliCommand } from 'cilly'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const addCmd = new CliCommand('add')
  .withArguments({
    name: 'name',
    description: 'Stream name',
    required: true,
  })
  .withHandler(async (args) => {
    const name = args.name

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const streamId = transact(doc, () => upsertStream({ doc, name }))
    if (streamId instanceof Error) {
      throw streamId
    }

    console.log(`Stream "${name}" added with id "${streamId}"`)

    await saveDoc()
  })

export { addCmd }
