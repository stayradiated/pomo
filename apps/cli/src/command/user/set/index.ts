import { CliCommand } from 'cilly'
import { z } from 'zod'
import { isValidTimeZone } from '@stayradiated/pomo-core'
import {
  setUserTimeZone,
  setUserStravaConfig,
  transact,
} from '@stayradiated/pomo-doc'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const $StravaConfig = z
  .string()
  .regex(/^\d+:[a-f\d]+$/)
  .transform((value) => {
    const [clientId, clientSecret] = value.split(':')
    if (clientId === undefined || clientSecret === undefined) {
      throw new Error('Invalid strava config')
    }

    return {
      clientId,
      clientSecret,
    }
  })

const $KeyValue = z.discriminatedUnion('key', [
  z.object({ key: z.literal('timezone'), value: z.string() }),
  z.object({ key: z.literal('strava-config'), value: $StravaConfig }),
])

const setCmd = new CliCommand('set')
  .withDescription('Set user info')
  .withArguments(
    {
      name: 'key',
      required: true,
    },
    {
      name: 'value',
      required: true,
    },
  )
  .withHandler(async (args, _options, _extra) => {
    const { key, value } = $KeyValue.parse({
      key: args['key'],
      value: args['value'],
    })

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    switch (key) {
      case 'timezone': {
        if (!isValidTimeZone(value)) {
          throw new Error(`Invalid time zone: ${value}`)
        }

        const result = transact(doc, () =>
          setUserTimeZone({ doc, timeZone: value }),
        )
        if (result instanceof Error) {
          throw result
        }

        break
      }

      case 'strava-config': {
        const result = transact(doc, () =>
          setUserStravaConfig({ doc, stravaConfig: value }),
        )
        if (result instanceof Error) {
          throw result
        }

        break
      }

      default: {
        throw new Error(`Unknown key: ${key}`)
      }
    }

    saveDoc()
  })

export { setCmd }
