import { CliCommand } from 'cilly'
import { exportCmd } from './export/index.js'

const togglCmd = new CliCommand('toggl')
  .withDescription('Integrate with Toggl')
  .withSubCommands(exportCmd)
  .withHandler(() => {
    togglCmd.help()
  })

export { togglCmd }
