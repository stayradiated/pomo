import { CliCommand } from 'cilly'
import { getCmd } from './get/index.js'
import { setCmd } from './set/index.js'

const userCmd = new CliCommand('user')
  .withDescription('Manage user info')
  .withSubCommands(setCmd, getCmd)
  .withHandler(() => {
    userCmd.help()
  })

export { userCmd }
