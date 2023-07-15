import { head } from './utils/head.js'
import type { Doc } from './types.js'

type GetUserStravaConfigOptions = {
  doc: Doc
}

type StravaConfig = {
  clientId: string
  clientSecret: string
}

const getUserStravaConfig = (
  options: GetUserStravaConfigOptions,
): StravaConfig | Error => {
  const { doc } = options

  const userMap = doc.getMap('user')

  const user = head(userMap.values())

  const clientId = user?.get('stravaClientId')
  const clientSecret = user?.get('stravaClientSecret')

  if (clientId === undefined || clientSecret === undefined) {
    return new Error('Strava client ID or secret not found')
  }

  return {
    clientId,
    clientSecret,
  }
}

export { getUserStravaConfig }
