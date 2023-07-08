import { CliCommand } from 'cilly'
import { migrate } from '@stayradiated/pomo-doc'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const fixCmd = new CliCommand('fix')
  .withDescription('Migrate schema of document')
  .withHandler(async () => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    migrate({ doc })

    await saveDoc()
  })

export { fixCmd }
