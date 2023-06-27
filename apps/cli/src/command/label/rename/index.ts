import { CliCommand } from 'cilly'

const renameCmd = new CliCommand('rename')
  .withDescription('Rename a label')
  .withHandler(() => {})

export { renameCmd }
