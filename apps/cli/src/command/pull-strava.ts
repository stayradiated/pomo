import type { KyselyDb } from '@stayradiated/pomo-db'
import { pullStravaActivities } from '#src/integration/strava.js'

type PullStravaCmdOptions = {
  db: KyselyDb
}

const pullStravaCmd = async (options: PullStravaCmdOptions) => {
  const { db } = options
  await pullStravaActivities({ db })
}

export { pullStravaCmd }
