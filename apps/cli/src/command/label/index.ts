import { CliCommand } from 'cilly'
import { renameCmd } from './rename/index.js'
import { listCmd } from './list/index.js'

const labelCmd = new CliCommand('label')
  .withDescription('Manage labels')
  .withSubCommands(listCmd, renameCmd)
  .withHandler(() => {
    labelCmd.help()
  })

export { labelCmd }
