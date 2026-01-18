import { CliCommand } from 'cilly'
import { checkCmd } from './check/index.js'
import { fixCmd } from './fix/index.js'

const schemaCmd = new CliCommand('schema')
  .withSubCommands(checkCmd, fixCmd)
  .withHandler(() => {
    schemaCmd.help()
  })

export { schemaCmd }
