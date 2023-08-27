import type { Doc } from '@stayradiated/pomo-doc'
import type { Line } from '@stayradiated/pomo-core'
import { retrievePointList, getLabelRecord } from '@stayradiated/pomo-doc'
import {
  mapPointListToLineList,
  clampLineList,
  formatDurationHMS,
} from '@stayradiated/pomo-core'
import { format as createCsvStream } from '@fast-csv/format'
import { formatInTimeZone } from 'date-fns-tz'

type ExportAsCsvOptions = {
  doc: Doc
  streamId: string
  currentTime: number
  startDate: number
  endDate: number
  timeZone: string
}

const exportAsCsv = async (
  options: ExportAsCsvOptions,
): Promise<void | Error> => {
  const { doc, streamId, currentTime, startDate, endDate, timeZone } = options

  const pointList = retrievePointList({
    doc,
    startDate,
    endDate,
    where: {
      streamIdList: [streamId],
    },
  })

  const extendedLineList = mapPointListToLineList(pointList)
  if (extendedLineList instanceof Error) {
    return extendedLineList
  }

  const lineList = clampLineList({
    lineList: extendedLineList,
    currentTime,
    startDate,
    endDate,
  })

  const labelRecord = getLabelRecord({ doc })

  const stream = createCsvStream({
    headers: [
      'id',
      'started_at',
      'stopped_at',
      'duration_sec',
      'label',
      'value',
    ],
  })
  stream.pipe(process.stdout)

  const formatLine = (line: Line, labelIndex?: number) => {
    const labelName =
      typeof labelIndex === 'number'
        ? labelRecord[line.labelIdList[labelIndex] ?? '']?.name
        : null
    return [
      line.id,
      formatInTimeZone(line.startedAt, timeZone, 'yyyy-MM-dd HH:mm:ss'),
      line.stoppedAt
        ? formatInTimeZone(line.stoppedAt, timeZone, 'yyyy-MM-dd HH:mm:ss')
        : null,
      formatDurationHMS(line.durationMs),
      labelName,
      line.value,
    ]
  }

  for (const line of lineList) {
    if (line.labelIdList.length === 0) {
      stream.write(formatLine(line))
    } else {
      for (let i = 0; i < line.labelIdList.length; i++) {
        stream.write(formatLine(line, i))
      }
    }
  }

  stream.end()
}

export { exportAsCsv }
