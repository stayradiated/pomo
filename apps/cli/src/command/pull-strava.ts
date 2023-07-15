import { CliCommand } from 'cilly'
import {
  getUserStravaConfig,
  getUserStravaSession,
  setUserStravaSession,
  transact,
} from '@stayradiated/pomo-doc'
import { pullStravaActivities } from '#src/integration/strava/index.js'
import type { Session } from '#src/integration/strava/index.js'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const pullStravaCmd = new CliCommand('pull-strava')
  .withDescription('Pull Strava activities')
  .withOptions({
    name: ['-f', '--force-fetch-all'],
    description: 'Force fetch all activities',
  })
  .withHandler(async (_args, options, _extra) => {
    const { forceFetchAll } = options

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const stravaConfig = getUserStravaConfig({ doc })
    if (stravaConfig instanceof Error) {
      throw stravaConfig
    }

    const { clientId, clientSecret } = stravaConfig

    let initialSession: Session | undefined
    const currentSession = getUserStravaSession({ doc })
    if (!(currentSession instanceof Error)) {
      initialSession = currentSession
    }

    const result = await pullStravaActivities({
      doc,
      clientId,
      clientSecret,
      initialSession,
      forceFetchAll,
    })
    if (result instanceof Error) {
      throw result
    }

    const updateResult = transact(doc, () =>
      setUserStravaSession({ doc, session: result.session }),
    )
    if (updateResult instanceof Error) {
      throw updateResult
    }

    await saveDoc()
  })

export { pullStravaCmd }
