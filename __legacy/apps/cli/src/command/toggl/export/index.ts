import { CliCommand } from 'cilly'
import { getDoc } from '#src/lib/doc.js'
import { exportTimeEntries } from './export-time-entries.js'
import { printTimeEntryListAsCSV } from './print-time-entry-list-as-csv.js'

const exportCmd = new CliCommand('export')
  .withDescription('Export time entries as a CSV file')
  .withHandler(async () => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const timeEntryList = exportTimeEntries({ doc })
    if (timeEntryList instanceof Error) {
      throw timeEntryList
    }

    printTimeEntryListAsCSV(timeEntryList)
  })

export { exportCmd }
