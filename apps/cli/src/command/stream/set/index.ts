import { getStreamByName, transact, updateStream } from '@stayradiated/pomo-doc'
import { CliCommand } from 'cilly'
import z from 'zod'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const $KeyValue = z.discriminatedUnion('key', [
  z.object({ key: z.literal('index'), value: z.coerce.number() }),
  z.object({ key: z.literal('parent'), value: z.string() }),
])

const setCmd = new CliCommand('set')
  .withDescription('Set a value for a specific stream')
  .withArguments(
    {
      name: 'stream',
      description: 'Stream name',
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
    const streamName = args.stream
    const { key, value } = $KeyValue.parse({
      key: args.key,
      value: args.value,
    })

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const stream = getStreamByName({ doc, name: streamName })
    if (stream instanceof Error) {
      throw stream
    }

    const streamId = stream.id

    switch (key) {
      case 'index': {
        const error = transact(doc, () =>
          updateStream({ doc, streamId, index: value }),
        )
        if (error) {
          throw error
        }

        break
      }

      case 'parent': {
        const parent = getStreamByName({ doc, name: value })
        if (parent instanceof Error) {
          throw parent
        }

        const error = transact(doc, () =>
          updateStream({ doc, streamId, parentId: parent.id }),
        )
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
