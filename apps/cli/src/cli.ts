import { CliCommand } from 'cilly'
import { csvCmd } from './command/csv/index.js'
import { extractLabelsCmd } from './command/extract-labels.js'
import { gcalCmd } from './command/gcal/index.js'
import { jsonCmd } from './command/json/index.js'
import { labelCmd } from './command/label/index.js'
import { logCmd } from './command/log/index.js'
import { migrateCmd } from './command/migrate.js'
import { pointCmd } from './command/point/index.js'
import { pullStravaCmd } from './command/pull-strava.js'
import { schemaCmd } from './command/schema/index.js'
import { statsCmd } from './command/stats/index.js'
import { statusCmd } from './command/status.js'
import { streamCmd } from './command/stream/index.js'
import { summaryCmd } from './command/summary.js'
import { syncCmd } from './command/sync.js'
import { togglCmd } from './command/toggl/index.js'
import { userCmd } from './command/user/index.js'

export const cli = new CliCommand('pomo')
  .withDescription('Get your program to your users easily')
  .withSubCommands(
    csvCmd,
    extractLabelsCmd,
    gcalCmd,
    jsonCmd,
    labelCmd,
    logCmd,
    migrateCmd,
    pointCmd,
    pullStravaCmd,
    schemaCmd,
    statsCmd,
    statusCmd,
    streamCmd,
    summaryCmd,
    syncCmd,
    togglCmd,
    userCmd,
  )
  .withHandler(() => {
    cli.help()
  })

cli.process(process.argv)
