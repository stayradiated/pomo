import { CliCommand } from 'cilly'
import { setCmd } from './set/index.js'
import { listCmd } from './list/index.js'
import { addCmd } from './add/index.js'

const streamCmd = new CliCommand('stream')
  .withDescription('Commands related to streams')
  .withSubCommands(addCmd, setCmd, listCmd)
  .withHandler(() => {
    streamCmd.help()
  })

export { streamCmd }
