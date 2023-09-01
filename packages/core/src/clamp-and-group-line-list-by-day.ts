import type { Line } from './types.js'
import {
  endOfDayWithTimeZone,
  eachDayOfIntervalWithTimeZone,
} from './date-with-time-zone.js'

type ClampAndGroupLineListByDayOptions = {
  lineList: Line[]
  currentTime: number
  startDate: number
  endDate: number
  timeZone: string
}

type DayLineListMap = Map<number, Line[]>

const clampAndGroupLineListByDay = (
  options: ClampAndGroupLineListByDayOptions,
): DayLineListMap => {
  const { lineList, currentTime, startDate, endDate, timeZone } = options

  const dayLineListMap: DayLineListMap = new Map()

  for (const line of lineList) {
    const isInDateRange =
      line.startedAt < endDate && (line.stoppedAt ?? currentTime) > startDate
    if (!isInDateRange) {
      continue
    }

    const startedAtClamped = Math.max(line.startedAt, startDate)
    const stoppedAtClamped = Math.min(line.stoppedAt ?? currentTime, endDate)

    const dayList = eachDayOfIntervalWithTimeZone({
      timeZone,
      startDate: startedAtClamped,
      endDate: stoppedAtClamped,
    })

    for (const dayStart of dayList) {
      const dayEnd = endOfDayWithTimeZone({
        timeZone,
        instant: dayStart.getTime(),
      })

      const lineStartedAtClamped = Math.max(line.startedAt, dayStart.getTime())
      const lineStoppedAtClamped = Math.min(
        line.stoppedAt ?? currentTime,
        dayEnd.getTime(),
      )
      const durationMs = lineStoppedAtClamped - lineStartedAtClamped

      const clampedLine = {
        ...line,
        startedAt: lineStartedAtClamped,
        stoppedAt: lineStoppedAtClamped,
        durationMs,
      }

      const lineList = dayLineListMap.get(dayStart.getTime()) ?? []
      lineList.push(clampedLine)
      dayLineListMap.set(dayStart.getTime(), lineList)
    }
  }

  return dayLineListMap
}

export { clampAndGroupLineListByDay }
