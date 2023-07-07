import { CliCommand } from 'cilly'
import { getStreamIdByRef, updateStream } from '@stayradiated/pomo-doc'
import z from 'zod'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const $KeyValue = z.discriminatedUnion('key', [
  z.object({ key: z.literal('index'), value: z.coerce.number() }),
  z.object({ key: z.literal('parentId'), value: z.string() }),
])

const setCmd = new CliCommand('set')
  .withDescription('Set a value for a specific stream')
  .withArguments(
    {
      name: 'stream',
      description: 'Stream reference',
      required: true,
    },
    {
      name: 'key',
      required: true,
    },
    {
      name: 'value',
      required: true,
    },
  )
  .withHandler(async (args) => {
    const ref = args['stream']
    const { key, value } = $KeyValue.parse({
      key: args['key'],
      value: args['value'],
    })

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const streamId = getStreamIdByRef({ doc, ref })
    if (!streamId) {
      throw new Error(`Stream "${ref}" not found`)
    }

    switch (key) {
      case 'index': {
        const error = updateStream({ doc, streamId, index: value })
        if (error) {
          throw error
        }

        break
      }

      case 'parentId': {
        const parentId = getStreamIdByRef({ doc, ref: value })
        if (!parentId) {
          throw new Error(`Stream "${value}" not found`)
        }

        const error = updateStream({ doc, streamId, parentId })
        if (error) {
          throw error
        }

        break
      }

      default: {
        throw new Error(`Unknown key ${key}`)
      }
    }

    await saveDoc()
  })

export { setCmd }
