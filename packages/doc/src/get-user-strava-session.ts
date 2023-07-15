import { head } from './utils/head.js'
import type { Doc } from './types.js'
import { NotFoundError } from './error.js'

type GetUserStravaSessionOptions = {
  doc: Doc
}

type StravaSession = {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

const getUserStravaSession = (
  options: GetUserStravaSessionOptions,
): StravaSession | Error => {
  const { doc } = options

  const userMap = doc.getMap('user')

  const user = head(userMap.values())

  const session = user?.get('stravaSession')

  if (!session) {
    return new NotFoundError('Strava session not found')
  }

  return session
}

export { getUserStravaSession }
