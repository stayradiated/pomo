import { CliCommand } from 'cilly'
import { client } from '@stayradiated/pomo-daemon'
import { pullStravaActivities } from '#src/integration/strava.js'

const pullStravaCmd = new CliCommand('pull-strava')
  .withDescription('Pull Strava activities')
  .withHandler(async (_args, _options, _extra) => {
    const trpc = client.getTrpcClient()
    await pullStravaActivities({ trpc })
  })

export { pullStravaCmd }
