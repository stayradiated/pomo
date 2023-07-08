import { CliCommand } from 'cilly'
import { addCmd } from './add/index.js'
import { renameCmd } from './rename/index.js'
import { listCmd } from './list/index.js'
import { mergeCmd } from './merge/index.js'
import { setCmd } from './set/index.js'

const labelCmd = new CliCommand('label')
  .withDescription('Manage labels')
  .withSubCommands(addCmd, listCmd, renameCmd, mergeCmd, setCmd)
  .withHandler(() => {
    labelCmd.help()
  })

export { labelCmd }
