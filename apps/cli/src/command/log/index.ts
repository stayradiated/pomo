import { startOfDayWithTimeZone } from '@stayradiated/pomo-core'
import { getStreamByName, getUserTimeZone } from '@stayradiated/pomo-doc'
import * as chrono from 'chrono-node'
import { CliCommand } from 'cilly'
import * as dateFns from 'date-fns'
import { getDoc } from '#src/lib/doc.js'
import { renderLog } from './log.js'

const logCmd = new CliCommand('log')
  .withDescription('Show a log of all points')
  .withOptions(
    {
      name: ['-s', '--stream'],
      description: 'Filter points by a Stream ',
      args: [
        { name: 'name', description: 'Name of the stream', required: true },
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

    const endDate = dateFns.addDays(startDate, options.span).getTime()

    let whereStreamId: string | undefined
    if (options.stream) {
      const stream = getStreamByName({ doc, name: options.stream })
      if (stream instanceof Error) {
        throw stream
      }

      whereStreamId = stream.id
    }

    const result = renderLog({
      doc,
      startDate,
      endDate,
      timeZone,
      where: { streamId: whereStreamId },
    })
    if (result instanceof Error) {
      throw result
    }
  })

export { logCmd }
