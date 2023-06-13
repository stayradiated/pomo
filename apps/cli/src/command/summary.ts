import { startOfDay } from 'date-fns'
import type { KyselyDb } from '@stayradiated/pomo-db'
import { stripComments, mapPointListToLineList } from '@stayradiated/pomo-core'
import { retrievePointList, getStreamNameById } from '@stayradiated/pomo-db'

type SummaryCmdOptions = {
  db: KyselyDb
  filter: {
    streamId: string | undefined
    value: string | undefined
  }
  currentTime: Date
}

const summaryCmd = async (
  options: SummaryCmdOptions,
): Promise<void | Error> => {
  const { db, filter, currentTime } = options

  const pointList = await retrievePointList({
    db,
    since: startOfDay(currentTime),
    filter,
  })
  if (pointList instanceof Error) {
    return pointList
  }

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  const filterValue = filter.value
  const filteredLineList =
    typeof filterValue === 'string'
      ? lineList.filter((line) => line.value.startsWith(filterValue))
      : lineList

  const totalDuration = new Map<string, Map<string, number>>()

  for (const line of filteredLineList) {
    const { streamId, value: rawValue, durationMs } = line
    const value = stripComments(rawValue)

    if (!totalDuration.has(streamId)) {
      totalDuration.set(streamId, new Map())
    }

    const childMap = totalDuration.get(streamId)!
    childMap.set(value, (childMap.get(value) ?? 0) + durationMs)
  }

  for (const entry of totalDuration.entries()) {
    const [streamId, values] = entry
    const name = await getStreamNameById({ db, id: streamId })
    if (name instanceof Error) {
      return name
    }

    for (const [value, duration] of values.entries()) {
      const hours = Math.round(duration / 1000 / 60 / 60)
      const minutes = Math.round(duration / 1000 / 60) % 60
      const seconds = Math.round(duration / 1000) % 60

      console.log(
        JSON.stringify({
          stream: name,
          value,
          duration: `${hours}h ${minutes}m ${seconds}s`,
        }),
      )
    }
  }

  return undefined
}

export { summaryCmd }
