import { CliCommand } from 'cilly'
import { daysCmd } from './days.js'

const statsCmd = new CliCommand('stats')
  .withDescription('Calculate stats')
  .withSubCommands(daysCmd)
  .withHandler(async () => {
    statsCmd.help()
  })

export { statsCmd }
