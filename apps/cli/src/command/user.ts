import { CliCommand } from 'cilly'
import { z } from 'zod'
import { isValidTimeZone } from '@stayradiated/pomo-core'
import { client } from '@stayradiated/pomo-daemon'

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

    const trpc = client.getTrpcClient()

    switch (key) {
      case 'timezone': {
        if (!isValidTimeZone(value)) {
          throw new Error(`Invalid time zone: ${value}`)
        }

        await trpc.setUserTimeZone.mutate({ timeZone: value })
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

    const trpc = client.getTrpcClient()

    switch (key) {
      case 'timezone': {
        const timeZone = await trpc.getUserTimeZone.query()
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
