import { CliCommand } from 'cilly'
import { z } from 'zod'
import {
  getUserTimeZone,
  getUserStravaConfig,
  getUserStravaSession,
} from '@stayradiated/pomo-doc'
import { getDoc } from '#src/lib/doc.js'

const $Key = z.enum(['timezone', 'strava-config', 'strava-session'])

const getCmd = new CliCommand('get')
  .withDescription('Get user info')
  .withArguments({
    name: 'key',
    required: true,
  })
  .withHandler(async (args, _options, _extra) => {
    const key = $Key.parse(args['key'].toLowerCase())

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    switch (key) {
      case 'timezone': {
        const timeZone = getUserTimeZone({ doc })
        console.info(timeZone)
        break
      }

      case 'strava-config': {
        const stravaConfig = getUserStravaConfig({ doc })
        if (stravaConfig instanceof Error) {
          throw stravaConfig
        }

        console.info(`${stravaConfig.clientId}:${stravaConfig.clientSecret}`)
        break
      }

      case 'strava-session': {
        const stravaSession = getUserStravaSession({ doc })
        if (stravaSession instanceof Error) {
          throw stravaSession
        }

        console.info(JSON.stringify(stravaSession, null, 2))
        break
      }

      default: {
        throw new Error(`Unknown key: ${key}`)
      }
    }
  })

export { getCmd }
