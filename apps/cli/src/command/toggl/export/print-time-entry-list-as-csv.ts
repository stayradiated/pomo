import { format as createCSVStream } from '@fast-csv/format'
import type { TimeEntry } from './types.js'

const printTimeEntryListAsCSV = (timeEntryList: TimeEntry[]) => {
  const stream = createCSVStream({
    headers: [
      'Email',
      'Duration', // HH:mm:ss format
      'Start Time', // HH:mm:ss format
      'Start Date', // Yyyy-MM-dd format
      'Description',
      'Project',
      'Task',
      'Client',
      'Tags', // Comma separated list
      'Billable', // Yes or No
    ],
  })
  stream.pipe(process.stdout)

  for (const timeEntry of timeEntryList) {
    stream.write([
      // Email
      timeEntry.email,
      // Duration
      timeEntry.duration,
      // Start Time
      timeEntry.startTime,
      // Start Date
      timeEntry.startDate,
      // Description
      timeEntry.description,
      // Project
      timeEntry.project,
      // Task
      timeEntry.task,
      // Client
      timeEntry.client,
      // Tags
      timeEntry.tags,
      // Billable
      timeEntry.billable,
    ])
  }

  stream.end()
}

export { printTimeEntryListAsCSV }
