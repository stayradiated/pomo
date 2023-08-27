import * as chrono from 'chrono-node'
import * as dateFns from 'date-fns'
import { CliCommand } from 'cilly'
import z from 'zod'
import { getUserTimeZone, getStreamByName } from '@stayradiated/pomo-doc'
import { startOfDayWithTimeZone } from '@stayradiated/pomo-core'
import { exportAsCsv } from './export.js'
import { getDoc } from '#src/lib/doc.js'

const $Options = z.object({
  stream: z.string(),
  date: z.string(),
  span: z.coerce.number(),
})

const exportCmd = new CliCommand('export')
  .withDescription('Export data as CSV document')
  .withOptions(
    {
      name: ['-s', '--stream'],
      description: 'Which stream to export',
      required: true,
      args: [
        {
          name: 'name',
          description: 'Name of the stream',
          required: true,
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
  .withHandler(async (_args, rawOptions) => {
    const options = $Options.parse(rawOptions)

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const currentTime = Date.now()
    const timeZone = getUserTimeZone({ doc })

    const startDate = startOfDayWithTimeZone({
      instant: chrono
        .parseDate(options.date, {
          instant: new Date(),
          timezone: timeZone,
        })
        .getTime(),
      timeZone,
    }).getTime()

    const endDate = dateFns.addDays(startDate, options.span).getTime()

    const stream = getStreamByName({ doc, name: options.stream })
    if (stream instanceof Error) {
      throw stream
    }

    const result = await exportAsCsv({
      doc,
      streamId: stream.id,
      currentTime,
      startDate,
      endDate,
      timeZone,
    })
    if (result instanceof Error) {
      throw result
    }
  })

const csvCmd = new CliCommand('csv')
  .withDescription('Export data to CSV')
  .withSubCommands(exportCmd)
  .withHandler(async () => {
    csvCmd.help()
  })

export { csvCmd }
