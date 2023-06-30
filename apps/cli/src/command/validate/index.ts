import { CliCommand } from 'cilly'
import { validate } from '@stayradiated/pomo-doc'
import { getDoc } from '#src/lib/doc.js'

const validateCmd = new CliCommand('validate')
  .withDescription('Validate schema of document')
  .withHandler(async () => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const result = validate({ doc })

    if (result) {
      for (const issue of result) {
        console.log(issue)
      }
    } else {
      console.log('Document is valid')
    }
  })

export { validateCmd }
