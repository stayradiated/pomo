import { CliCommand } from 'cilly'
import { logCmd } from './command/log.js'
import { editCmd } from './command/edit.js'
import { userCmd } from './command/user.js'
import { statusCmd } from './command/status.js'
import { summaryCmd } from './command/summary.js'
import { pullStravaCmd } from './command/pull-strava.js'
import { automergeCmd } from './command/automerge.js'
import { daemonCmd } from './command/daemon.js'
import { exportCmd } from './command/export.js'

export const cli = new CliCommand('pomo')
  .withDescription('Get your program to your users easily')
  .withSubCommands(
    logCmd,
    editCmd,
    userCmd,
    statusCmd,
    summaryCmd,
    pullStravaCmd,
    exportCmd,

    automergeCmd,
    daemonCmd,
  )
  .withHandler(() => {
    cli.help()
  })

cli.process(process.argv)
