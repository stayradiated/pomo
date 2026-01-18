import {
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'

type WithTimeZoneOptions = {
  timeZone: string
  instant: number
}

const startOfDayWithTimeZone = (options: WithTimeZoneOptions): Date => {
  const { timeZone, instant } = options
  const instantZoned = toZonedTime(instant, timeZone)
  const dayStartZoned = startOfDay(instantZoned)
  const dayStart = fromZonedTime(dayStartZoned, timeZone)
  return dayStart
}

const endOfDayWithTimeZone = (options: WithTimeZoneOptions): Date => {
  const { timeZone, instant } = options
  const instantZoned = toZonedTime(instant, timeZone)
  const dayEndZoned = endOfDay(instantZoned)
  const dayEnd = fromZonedTime(dayEndZoned, timeZone)
  return dayEnd
}

type WeekWithTimeZoneOptions = WithTimeZoneOptions & {
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

const startOfWeekWithTimeZone = (options: WeekWithTimeZoneOptions): Date => {
  const { timeZone, instant, weekStartsOn = 0 } = options
  const instantZoned = toZonedTime(instant, timeZone)
  const dayStartZoned = startOfWeek(instantZoned, { weekStartsOn })
  const dayStart = fromZonedTime(dayStartZoned, timeZone)
  return dayStart
}

const endOfWeekWithTimeZone = (options: WeekWithTimeZoneOptions): Date => {
  const { timeZone, instant, weekStartsOn = 0 } = options
  const instantZoned = toZonedTime(instant, timeZone)
  const dayEndZoned = endOfWeek(instantZoned, { weekStartsOn })
  const dayEnd = fromZonedTime(dayEndZoned, timeZone)
  return dayEnd
}

const startOfMonthWithTimeZone = (options: WithTimeZoneOptions): Date => {
  const { timeZone, instant } = options
  const instantZoned = toZonedTime(instant, timeZone)
  const dayStartZoned = startOfMonth(instantZoned)
  const dayStart = fromZonedTime(dayStartZoned, timeZone)
  return dayStart
}

const endOfMonthWithTimeZone = (options: WithTimeZoneOptions): Date => {
  const { timeZone, instant } = options
  const instantZoned = toZonedTime(instant, timeZone)
  const dayEndZoned = endOfMonth(instantZoned)
  const dayEnd = fromZonedTime(dayEndZoned, timeZone)
  return dayEnd
}

type IntervalWithTimeZoneOptions = {
  timeZone: string
  startDate: number
  endDate: number
}

const eachDayOfIntervalWithTimeZone = (
  options: IntervalWithTimeZoneOptions,
): Date[] => {
  const { timeZone, startDate, endDate } = options
  const startDateZoned = toZonedTime(startDate, timeZone)
  const endDateZoned = toZonedTime(endDate, timeZone)
  const dayListZoned = eachDayOfInterval({
    start: startDateZoned,
    end: endDateZoned,
  })
  const dayList = dayListZoned.map((dayZoned) =>
    fromZonedTime(dayZoned, timeZone),
  )
  return dayList
}

type EachWeekOfIntervalWithTimeZoneOptions = IntervalWithTimeZoneOptions & {
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

const eachWeekOfIntervalWithTimeZone = (
  options: EachWeekOfIntervalWithTimeZoneOptions,
): Date[] => {
  const { timeZone, startDate, endDate, weekStartsOn } = options
  const startDateZoned = toZonedTime(startDate, timeZone)
  const endDateZoned = toZonedTime(endDate, timeZone)
  const weekListZoned = eachWeekOfInterval(
    {
      start: startDateZoned,
      end: endDateZoned,
    },
    {
      weekStartsOn,
    },
  )
  const weekList = weekListZoned.map((weekZoned) =>
    fromZonedTime(weekZoned, timeZone),
  )
  return weekList
}

export {
  startOfWeekWithTimeZone,
  endOfWeekWithTimeZone,
  startOfDayWithTimeZone,
  endOfDayWithTimeZone,
  startOfMonthWithTimeZone,
  endOfMonthWithTimeZone,
  eachDayOfIntervalWithTimeZone,
  eachWeekOfIntervalWithTimeZone,
}
