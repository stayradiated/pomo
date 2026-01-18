import { getStreamByName } from '@stayradiated/pomo-doc'
import { CliCommand } from 'cilly'
import z from 'zod'
import { getDoc } from '#src/lib/doc.js'
import { listLabelsAsJson } from './json/index.js'
import { listLabelsAsTable } from './table/index.js'

const $Options = z.object({
  stream: z.string().optional(),
  format: z.enum(['json', 'table']),
})

const listCmd = new CliCommand('list')
  .withDescription('List labels')
  .withOptions(
    {
      name: ['-s', '--stream'],
      description: 'Only list labels for a single stream',
      args: [
        {
          name: 'name',
          description: 'Name of the stream to list labels for',
          required: true,
        },
      ],
    },
    {
      name: ['-f', '--format'],
      description: 'Output format',
      defaultValue: 'table',
      args: [
        {
          name: 'format',
          description: 'Output format (json, table)',
        },
      ],
    },
  )
  .withHandler(async (_args, options) => {
    const { stream: streamName, format } = $Options.parse(options)

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    let whereStreamId: string | undefined
    if (streamName) {
      const stream = getStreamByName({ doc, name: streamName })
      if (stream instanceof Error) {
        throw stream
      }

      whereStreamId = stream.id
    }

    switch (format) {
      case 'json': {
        const result = listLabelsAsJson({ doc, streamId: whereStreamId })
        if (result instanceof Error) {
          throw result
        }

        break
      }

      case 'table': {
        const result = listLabelsAsTable({ doc, streamId: whereStreamId })
        if (result instanceof Error) {
          throw result
        }

        break
      }
    }
  })

export { listCmd }
