import { CliCommand } from 'cilly'
import { editCmd } from './command/edit.js'
import { extractLabelsCmd } from './command/extract-labels.js'
import { jsonCmd } from './command/json/index.js'
import { labelCmd } from './command/label/index.js'
import { logCmd } from './command/log/index.js'
import { migrateCmd } from './command/migrate.js'
import { pullStravaCmd } from './command/pull-strava.js'
import { statusCmd } from './command/status.js'
import { summaryCmd } from './command/summary.js'
import { syncCmd } from './command/sync.js'
import { userCmd } from './command/user.js'
import { validateCmd } from './command/validate/index.js'
import { streamCmd } from './command/stream/index.js'
import { togglCmd } from './command/toggl/index.js'
import { gcalCmd } from './command/gcal/index.js'

export const cli = new CliCommand('pomo')
  .withDescription('Get your program to your users easily')
  .withSubCommands(
    editCmd,
    extractLabelsCmd,
    jsonCmd,
    labelCmd,
    logCmd,
    migrateCmd,
    pullStravaCmd,
    statusCmd,
    streamCmd,
    summaryCmd,
    syncCmd,
    userCmd,
    validateCmd,
    togglCmd,
    gcalCmd,
  )
  .withHandler(() => {
    editCmd.process(process.argv)
  })

cli.process(process.argv)
