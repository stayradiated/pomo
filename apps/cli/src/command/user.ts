import { CliCommand } from 'cilly'
import { z } from 'zod'
import { isValidTimeZone } from '@stayradiated/pomo-core'
import { proxy } from '#src/lib/proxy.js'

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

    switch (key) {
      case 'timezone': {
        if (!isValidTimeZone(value)) {
          throw new Error(`Invalid time zone: ${value}`)
        }

        const result = await proxy.setUserTimeZone({ timeZone: value })
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

    switch (key) {
      case 'timezone': {
        const timeZone = await proxy.getUserTimeZone({})
        console.info(timeZone)
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
