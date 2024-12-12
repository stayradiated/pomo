import { CliCommand } from 'cilly'
import { getDoc } from '#src/lib/doc.js'
import { exportEventList } from './export-event-list.js'
import { printEventListAsCSV } from './print-event-list-as-csv.js'

const exportCmd = new CliCommand('export')
  .withDescription('Export time entries as a CSV file')
  .withHandler(async () => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const eventList = exportEventList({
      doc,
      startDateString: '2023-06-27',
      endDateString: '2023-06-27',
    })
    if (eventList instanceof Error) {
      throw eventList
    }

    printEventListAsCSV(eventList)
  })

export { exportCmd }
