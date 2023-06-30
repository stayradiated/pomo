import { CliCommand } from 'cilly'
import { renameCmd } from './rename/index.js'
import { listCmd } from './list/index.js'
import { mergeCmd } from './merge/index.js'

const labelCmd = new CliCommand('label')
  .withDescription('Manage labels')
  .withSubCommands(listCmd, renameCmd, mergeCmd)
  .withHandler(() => {
    labelCmd.help()
  })

export { labelCmd }
