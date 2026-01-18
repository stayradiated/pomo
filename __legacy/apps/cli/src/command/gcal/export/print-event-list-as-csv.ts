import { format as createCSVStream } from '@fast-csv/format'
import type { Event } from './types.js'

const printEventListAsCSV = (eventList: Event[]) => {
  const stream = createCSVStream({
    headers: [
      'Subject',
      'Start Date',
      'Start Time',
      'End Date',
      'End Time',
      'All Day Event',
      'Description',
      'Location',
      'Private',
    ],
  })
  stream.pipe(process.stdout)

  for (const event of eventList) {
    stream.write([
      event.subject,
      event.startDate,
      event.startTime,
      event.endDate,
      event.endTime,
      event.allDayEvent,
      event.description,
      event.location,
      event.private,
    ])
  }

  stream.end()
}

export { printEventListAsCSV }
