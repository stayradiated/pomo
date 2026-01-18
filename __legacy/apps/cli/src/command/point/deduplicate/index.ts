import {
  mapLineListToVerboseSliceList,
  mapPointListToLineList,
} from '@stayradiated/pomo-core'
import {
  deletePoints,
  getLabelRecord,
  getPointList,
  getStreamRecord,
  getUserTimeZone,
  transact,
} from '@stayradiated/pomo-doc'
import { CliCommand } from 'cilly'
import * as dateFnsTz from 'date-fns-tz'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const equalStringArray = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) {
    return false
  }

  for (let i = 0, length = a.length; i < length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

const deduplicateCmd = new CliCommand('deduplicate').withHandler(async () => {
  const doc = await getDoc()
  if (doc instanceof Error) {
    throw doc
  }

  const timeZone = getUserTimeZone({ doc })

  const pointList = getPointList({ doc })
  const streamRecord = getStreamRecord({ doc })
  const labelRecord = getLabelRecord({ doc })

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    throw lineList
  }

  const sliceList = mapLineListToVerboseSliceList(lineList)
  const duplicatePointIdSet = new Set<string>()

  for (let i = 0, length = sliceList.length; i < length; i++) {
    const slice = sliceList[i]
    if (!slice) {
      continue
    }

    const previousSlice = sliceList[i - 1]
    if (!previousSlice) {
      continue
    }

    for (const line of slice.lineList) {
      const previousLine = previousSlice.lineList.find(
        (l) => l.streamId === line.streamId,
      )
      if (!previousLine) {
        continue
      }

      if (line === previousLine) {
        continue
      }

      if (
        line.value === previousLine.value &&
        equalStringArray(line.labelIdList, previousLine.labelIdList)
      ) {
        const streamName = streamRecord[line.streamId]?.name
        const labelNameList = line.labelIdList.map(
          (labelId) => labelRecord[labelId]?.name,
        )

        const lineStartedAt = dateFnsTz.formatInTimeZone(
          line.startedAt,
          timeZone,
          'yyyy-MM-dd HH:mm:ss',
        )
        const previousLineStartedAt = dateFnsTz.formatInTimeZone(
          previousLine.startedAt,
          timeZone,
          'yyyy-MM-dd HH:mm:ss',
        )

        console.log(
          `• ${previousLineStartedAt} • ${lineStartedAt} • ${streamName} [${labelNameList.join(
            ', ',
          )}]`,
        )

        duplicatePointIdSet.add(line.id)
      }
    }
  }

  const duplicatePointIdList = Array.from(duplicatePointIdSet)
  console.log(`Deleting ${duplicatePointIdList.length} duplicate points`)
  console.log(duplicatePointIdList)
  const result = transact(doc, () =>
    deletePoints({ doc, pointIdList: duplicatePointIdList }),
  )
  if (result instanceof Error) {
    throw result
  }

  await saveDoc()
})

export { deduplicateCmd }
