import { startOfDay } from 'date-fns'
import type { KyselyDb } from '#src/core/db.js'
import { getNextValue, getTimings } from '#src/core/line.js'
import { stripComments } from '#src/core/text.js'
import { retrievePointList } from '#src/core/retrieve-point-list.js'
import { getStreamIdByName } from '#src/core/get-stream-id-by-name.js'
import { getStreamNameById } from '#src/core/get-stream-name-by-id.js'

type StatsCmdOptions = {
  db: KyselyDb
  filter: {
    streamName: string | undefined
  }
  currentTime: Date
}

const statsCmd = async (options: StatsCmdOptions): Promise<void | Error> => {
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

  const totalDuration: Record<string, Record<string, number>> = {}

  for (const point of pointList) {
    const nextPoint = getNextValue(pointList, point)
    if (nextPoint instanceof Error) {
      return nextPoint
    }

    const { streamId, value: rawValue } = point
    const value = stripComments(rawValue)

    const name = await getStreamNameById({ db, id: streamId })
    if (name instanceof Error) {
      return name
    }

    const { durationMs } = getTimings(point, nextPoint)

    totalDuration[name] ??= {}
    totalDuration[name]![value] ??= 0
    totalDuration[name]![value] += durationMs
  }

  for (const [name, values] of Object.entries(totalDuration)) {
    console.log(`# ${name}`)
    for (const [value, duration] of Object.entries(values)) {
      const hours = Math.round(duration / 1000 / 60 / 60)
      const minutes = Math.round(duration / 1000 / 60) % 60
      console.log(`- ${value} (${hours}h${minutes}m)`)
    }
  }

  return undefined
}

export { statsCmd }
