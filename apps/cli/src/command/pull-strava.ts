import { CliCommand } from 'cilly'
import { pullStravaActivities } from '#src/integration/strava.js'
import { getDb } from '#src/lib/db.js'

const pullStravaCmd = new CliCommand('pull-strava')
  .withDescription('Pull Strava activities')
  .withHandler(async (_args, _options, _extra) => {
    const db = getDb()
    await pullStravaActivities({ db })
  })

export { pullStravaCmd }
