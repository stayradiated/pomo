import { CliCommand } from 'cilly'
import { getLabelIdByRef, updateLabel } from '@stayradiated/pomo-doc'
import z from 'zod'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const $KeyValue = z.discriminatedUnion('key', [
  z.object({ key: z.literal('name'), value: z.string() }),
  z.object({ key: z.literal('color'), value: z.string() }),
  z.object({ key: z.literal('parentId'), value: z.string() }),
])

const setCmd = new CliCommand('set')
  .withDescription('Set a value for a specific label')
  .withArguments(
    {
      name: 'label',
      description: 'Label reference',
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
    const ref = args['label']
    const { key, value } = $KeyValue.parse({
      key: args['key'],
      value: args['value'],
    })

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const labelId = getLabelIdByRef({ doc, ref })
    if (!labelId) {
      throw new Error(`Label "${ref}" not found`)
    }

    switch (key) {
      case 'name': {
        const error = updateLabel({ doc, labelId, name: value })
        if (error) {
          throw error
        }

        break
      }

      case 'color': {
        const error = updateLabel({ doc, labelId, color: value })
        if (error) {
          throw error
        }

        break
      }

      case 'parentId': {
        const parentId = getLabelIdByRef({ doc, ref: value })
        if (!parentId) {
          throw new Error(`Stream "${value}" not found`)
        }

        const error = updateLabel({ doc, labelId, parentId })
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
