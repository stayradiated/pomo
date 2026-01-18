import { CliCommand } from 'cilly'
import { deduplicateCmd } from './deduplicate/index.js'

const pointCmd = new CliCommand('point')
  .withSubCommands(deduplicateCmd)
  .withHandler(() => {
    pointCmd.help()
  })

export { pointCmd }
