import { CliCommand } from 'cilly'
import { z } from 'zod'
import { getUserTimeZone, setUserTimeZone } from '@stayradiated/pomo-db'
import { isValidTimeZone } from '@stayradiated/pomo-core'
import { getDb } from '#src/lib/db.js'

const $Key = z.literal('timezone')

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
    const key = $Key.parse(args['key'].toLowerCase())
    const value = args['value']

    const db = getDb()

    switch (key) {
      case 'timezone': {
        if (!isValidTimeZone(value)) {
          throw new Error(`Invalid time zone: ${value}`)
        }

        const result = await setUserTimeZone({ db, timeZone: value })
        if (result instanceof Error) {
          throw result
        }

        break
      }
    }
  })

const getCmd = new CliCommand('get')
  .withDescription('Get user info')
  .withArguments({
    name: 'key',
    required: true,
  })
  .withHandler(async (args, _options, _extra) => {
    const key = $Key.parse(args['key'].toLowerCase())

    const db = getDb()

    switch (key) {
      case 'timezone': {
        const timeZone = await getUserTimeZone({ db })
        console.log(timeZone)
        break
      }
    }
  })

const userCmd = new CliCommand('user')
  .withDescription('Edit user info')
  .withSubCommands(setCmd, getCmd)
  .withHandler(() => {
    userCmd.help()
  })

export { userCmd }
