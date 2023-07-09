import { CliCommand } from 'cilly'
import { addCmd } from './add/index.js'
import { listCmd } from './list/index.js'
import { mergeCmd } from './merge/index.js'
import { moveToStreamCmd } from './move-to-stream/index.js'
import { renameCmd } from './rename/index.js'
import { setCmd } from './set/index.js'
import { deleteCmd } from './delete/index.js'

const labelCmd = new CliCommand('label')
  .withDescription('Manage labels')
  .withSubCommands(
    addCmd,
    deleteCmd,
    listCmd,
    mergeCmd,
    moveToStreamCmd,
    renameCmd,
    setCmd,
  )
  .withHandler(() => {
    labelCmd.help()
  })

export { labelCmd }
