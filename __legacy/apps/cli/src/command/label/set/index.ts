import {
  getLabelByName,
  getStreamByName,
  transact,
  updateLabel,
} from '@stayradiated/pomo-doc'
import { CliCommand } from 'cilly'
import z from 'zod'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const $KeyValue = z.discriminatedUnion('key', [
  z.object({ key: z.literal('name'), value: z.string() }),
  z.object({ key: z.literal('color'), value: z.string() }),
  z.object({ key: z.literal('parent'), value: z.string() }),
])

const setCmd = new CliCommand('set')
  .withDescription('Set a value for a specific label')
  .withArguments(
    {
      name: 'stream',
      description: 'Stream name',
      required: true,
    },
    {
      name: 'label',
      description: 'Label name',
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
    const { label: labelName, stream: streamName } = args

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

    const label = getLabelByName({ doc, streamId: stream.id, name: labelName })
    if (label instanceof Error) {
      throw label
    }

    switch (key) {
      case 'name': {
        const error = transact(doc, () =>
          updateLabel({ doc, labelId: label.id, name: value }),
        )
        if (error) {
          throw error
        }

        break
      }

      case 'color': {
        const error = transact(doc, () =>
          updateLabel({ doc, labelId: label.id, color: value }),
        )
        if (error) {
          throw error
        }

        break
      }

      case 'parent': {
        const streamParentId = stream.parentId
        if (!streamParentId) {
          throw new Error(`Stream ${streamName} has no parent`)
        }

        const parent = getLabelByName({
          doc,
          streamId: streamParentId,
          name: value,
        })
        if (parent instanceof Error) {
          throw parent
        }

        const error = transact(doc, () =>
          updateLabel({ doc, labelId: label.id, parentId: parent.id }),
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
