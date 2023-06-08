import * as process from 'node:process'
import { format, startOfDay } from 'date-fns'
import * as fastCSV from '@fast-csv/format'
import type { KyselyDb } from '#src/core/db.js'
import { mapPointListToLineList } from '#src/core/line.js'
import { stripComments } from '#src/core/text.js'
import { retrievePointList } from '#src/core/retrieve-point-list.js'
import { getStreamIdByName } from '#src/core/get-stream-id-by-name.js'
import { getStreamNameById } from '#src/core/get-stream-name-by-id.js'

type LogCmdOptions = {
  db: KyselyDb
  filter: {
    streamName: string | undefined
  }
  currentTime: Date
}

const logCmd = async (options: LogCmdOptions): Promise<void | Error> => {
  const { db, filter, currentTime } = options

  const filterStreamId = filter.streamName
    ? await getStreamIdByName({ db, name: filter.streamName })
    : undefined

  if (filterStreamId instanceof Error) {
    return filterStreamId
  }

  const pointList = await retrievePointList({
    db,
    since: startOfDay(currentTime),
    filter: {
      streamId: filterStreamId,
    },
  })

  const stream = fastCSV.format({ delimiter: ',' })
  stream.pipe(process.stdout)

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  for (const line of lineList) {
    const { value: rawValue, startedAt, stoppedAt, durationMs } = line
    const value = stripComments(rawValue)

    const minutes = Math.round(durationMs / 1000 / 60)

    const startedAtHHmm = format(startedAt, 'HH:mm')
    const stoppedAtHHmm = stoppedAt ? format(stoppedAt, 'HH:mm') : '--:--'

    const name = await getStreamNameById({ db, id: line.streamId })
    if (name instanceof Error) {
      return name
    }

    stream.write([startedAtHHmm, stoppedAtHHmm, `${minutes}m`, name, value])
  }

  return undefined
}

export { logCmd }
