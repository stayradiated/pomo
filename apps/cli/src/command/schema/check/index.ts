import { CliCommand } from 'cilly'
import { validate } from '@stayradiated/pomo-doc'
import { ZodError } from 'zod'
import { getDoc } from '#src/lib/doc.js'

const checkCmd = new CliCommand('check')
  .withDescription('Validate schema of document')
  .withHandler(async () => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const result = validate({ doc })

    if (result instanceof Error) {
      if (result instanceof ZodError) {
        for (const issue of result.issues) {
          console.error(issue)
        }
      } else {
        console.error(result)
      }
    } else {
      console.log('Document is valid')
    }
  })

export { checkCmd }
