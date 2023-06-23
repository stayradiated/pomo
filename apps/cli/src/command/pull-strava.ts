import { CliCommand } from 'cilly'
import { pullStravaActivities } from '#src/integration/strava.js'

const pullStravaCmd = new CliCommand('pull-strava')
  .withDescription('Pull Strava activities')
  .withHandler(async (_args, _options, _extra) => {
    await pullStravaActivities({})
  })

export { pullStravaCmd }
