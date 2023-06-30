import { CliCommand } from 'cilly'
import { setCmd } from './set/index.js'
import { listCmd } from './list/index.js'

const streamCmd = new CliCommand('stream')
  .withDescription('Commands related to streams')
  .withSubCommands(setCmd, listCmd)
  .withHandler(() => {
    streamCmd.help()
  })

export { streamCmd }
