import * as process from 'node:process'
import { format, startOfDay } from 'date-fns'
import * as fastCSV from '@fast-csv/format'
import type { KyselyDb } from '#src/core/db.js'
import { mapPointListToLineList } from '#src/core/line.js'
import { mapLineListToSliceList } from '#src/core/slice.js'
import { stripComments } from '#src/core/text.js'
import { retrievePointList } from '#src/core/retrieve-point-list.js'
import { getStreamIdByName } from '#src/core/get-stream-id-by-name.js'

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
  if (pointList instanceof Error) {
    return pointList
  }

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  const sliceList = mapLineListToSliceList(lineList)
  if (sliceList instanceof Error) {
    return sliceList
  }

  const streamList = await Promise.all(
    ['country', 'location', 'project', 'task'].map(async (name) => {
      const id = await getStreamIdByName({ db, name })
      if (id instanceof Error) {
        throw id
      }

      return {
        id,
        name,
      }
    }),
  )

  const output = fastCSV.format({
    delimiter: ',',
    headers: ['time', ...streamList.map((stream) => stream.name)],
  })
  output.pipe(process.stdout)

  for (const slice of sliceList) {
    const { startedAt, lineList } = slice
    const startedAtHHmm = format(startedAt, 'HH:mm')

    const row: string[] = Array.from({ length: streamList.length + 1 })
    row[0] = startedAtHHmm

    for (const [index, stream] of streamList.entries()) {
      const line = lineList.find((line) => line.streamId === stream.id)
      if (!line) {
        continue
      }

      row[index + 1] = stripComments(line.value)
    }

    output.write(row)
  }

  return undefined
}

export { logCmd }
