import { CliCommand } from 'cilly'
import { upsertLabel, getStreamIdByRef } from '@stayradiated/pomo-doc'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const addCmd = new CliCommand('add')
  .withArguments({
    name: 'streamId',
    description: 'Stream ID',
    required: true,
  }, {
    name: 'name',
    description: 'Label name',
    required: true,
  })
  .withHandler(async (args) => {
    const name = args['name']
    const streamRef = args['streamId']

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const streamId = getStreamIdByRef({ doc, ref: streamRef })
    if (typeof streamId === 'undefined') {
      throw new Error(`Stream "${streamRef}" not found`)
    }

    const labelId = upsertLabel({ doc, streamId, name })

    console.log(`Label "${name}" added with id "${labelId}"`)

    await saveDoc()
  })

export { addCmd }
