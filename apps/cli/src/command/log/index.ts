import { startOfDayWithTimeZone } from '@stayradiated/pomo-core'
import { getStreamByName, getUserTimeZone } from '@stayradiated/pomo-doc'
import * as chrono from 'chrono-node'
import { CliCommand } from 'cilly'
import * as dateFns from 'date-fns'
import { getDoc } from '#src/lib/doc.js'
import { renderLog } from './render-log.js'

const logCmd = new CliCommand('log')
  .withDescription('Show a log of all points')
  .withOptions(
    {
      name: ['-s', '--stream'],
      description: 'Filter points by a Stream ',
      args: [
        {
          name: 'name',
          description: 'Name of the stream',
          required: true,
          variadic: true,
        },
      ],
    },
    {
      name: ['-d', '--date'],
      description: 'Show points from a certain time',
      defaultValue: 'today',
      args: [
        {
          name: 'datetime',
          description: 'Date/time to show points from',
          required: true,
        },
      ],
    },
    {
      name: ['-p', '--span'],
      description: 'How many days to show',
      defaultValue: 1,
      args: [
        {
          name: 'days',
          description: 'Number of days',
          required: true,
        },
      ],
    },
  )
  .withHandler(async (_args, options, _extra) => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const timeZone = getUserTimeZone({ doc })

    const instant = chrono
      .parseDate(options.date, {
        instant: new Date(),
        timezone: timeZone,
      })
      ?.getTime()

    if (typeof instant !== 'number') {
      throw new Error(`Could not parse date: ${options.date}`)
    }

    const startDate = startOfDayWithTimeZone({
      instant,
      timeZone,
    }).getTime()

    const endDate = dateFns
      .addDays(startDate, Number.parseInt(options.span, 10))
      .getTime()

    const whereStreamId: string[] = []
    if (Array.isArray(options.stream)) {
      for (const streamName of options.stream) {
        const stream = getStreamByName({ doc, name: streamName })
        if (stream instanceof Error) {
          throw stream
        }
        whereStreamId.push(stream.id)
      }
    }

    const result = renderLog({
      doc,
      startDate,
      endDate,
      timeZone,
      where: {
        streamId: whereStreamId.length ? { in: whereStreamId } : undefined,
      },
    })
    if (result instanceof Error) {
      throw result
    }
  })

export { logCmd }
