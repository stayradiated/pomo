import { CliCommand } from 'cilly'
import { pullStravaActivities } from '#src/integration/strava.js'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const pullStravaCmd = new CliCommand('pull-strava')
  .withDescription('Pull Strava activities')
  .withHandler(async (_args, _options, _extra) => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const result = await pullStravaActivities({ doc })
    if (result instanceof Error) {
      throw result
    }

    await saveDoc()
  })

export { pullStravaCmd }
