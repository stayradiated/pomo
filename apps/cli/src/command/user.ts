// Import * as chrono from 'chrono-node'
import { CliCommand } from 'cilly'
// Import { getDb } from '#src/lib/db.js'

const setCmd = new CliCommand('set')
  .withDescription('Set user info')
  .withArguments(
    {
      name: 'key',
      required: true,
    },
    {
      name: 'value',
      required: true,
    },
  )
  .withHandler(() => {
    setCmd.help()
  })

const getCmd = new CliCommand('get')
  .withDescription('Get user info')
  .withArguments({
    name: 'key',
    required: true,
  })
  .withHandler(() => {
    getCmd.help()
  })

const userCmd = new CliCommand('user')
  .withDescription('Edit user info')
  .withSubCommands(setCmd, getCmd)
  .withHandler(() => {
    userCmd.help()
  })

export { userCmd }
