import { CliCommand } from 'cilly'
// Import { saveDoc} from '#src/lib/doc.js'
import {
  getPointList,
  getLabelRecord,
  getStreamRecord,
} from '@stayradiated/pomo-doc'
import {
  mapPointListToLineList,
  mapLineListToVerboseSliceList,
} from '@stayradiated/pomo-core'
import { getDoc } from '#src/lib/doc.js'

const migrateCmd = new CliCommand('migrate')
  .withDescription('Migrate schema of document')
  .withHandler(async () => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const labelRecord = getLabelRecord({ doc })
    const streamRecord = getStreamRecord({ doc })

    const pointList = getPointList({ doc })
    const lineList = mapPointListToLineList(pointList)
    if (lineList instanceof Error) {
      throw lineList
    }

    const sliceList = mapLineListToVerboseSliceList(lineList)

    for (const slice of sliceList) {
      const { lineList } = slice

      lineList.map((line) => {
        const streamName = streamRecord[line.streamId]?.name ?? ''
        const labelNames = JSON.stringify(
          line.labelIdList.map((labelId) => labelRecord[labelId]?.name ?? ''),
        )
        console.log(`${streamName} ${labelNames}`)
      })

      console.log('\n---\n')
    }

    // Await saveDoc()
  })

export { migrateCmd }
