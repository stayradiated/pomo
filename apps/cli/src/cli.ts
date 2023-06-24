import { CliCommand } from 'cilly'
import { logCmd } from './command/log/index.js'
import { editCmd } from './command/edit.js'
import { userCmd } from './command/user.js'
import { statusCmd } from './command/status.js'
import { summaryCmd } from './command/summary.js'
import { pullStravaCmd } from './command/pull-strava.js'
import { jsonCmd } from './command/json/index.js'
import { syncCmd } from './command/sync.js'
import { extractLabelsCmd } from './command/extract-labels.js'
import { migrateCmd } from './command/migrate.js'

export const cli = new CliCommand('pomo')
  .withDescription('Get your program to your users easily')
  .withSubCommands(
    logCmd,
    editCmd,
    userCmd,
    statusCmd,
    summaryCmd,
    pullStravaCmd,
    jsonCmd,
    syncCmd,

    extractLabelsCmd,
    migrateCmd,
  )
  .withHandler(() => {
    editCmd.process(process.argv)
  })

cli.process(process.argv)
