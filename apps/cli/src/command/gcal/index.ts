import { CliCommand } from 'cilly'
import { exportCmd } from './export/index.js'

const gcalCmd = new CliCommand('gcal')
  .withDescription('Integrate with Google Calendar')
  .withSubCommands(exportCmd)
  .withHandler(() => {
    gcalCmd.help()
  })

export { gcalCmd }
