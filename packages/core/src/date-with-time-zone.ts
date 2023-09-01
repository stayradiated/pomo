import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

type DayWithTimeZoneOptions = {
  timeZone: string
  instant: number
}

const startOfDayWithTimeZone = (options: DayWithTimeZoneOptions): Date => {
  const { timeZone, instant } = options
  const instantZoned = utcToZonedTime(instant, timeZone)
  const dayStartZoned = startOfDay(instantZoned)
  const dayStart = zonedTimeToUtc(dayStartZoned, timeZone)
  return dayStart
}

const endOfDayWithTimeZone = (options: DayWithTimeZoneOptions): Date => {
  const { timeZone, instant } = options
  const instantZoned = utcToZonedTime(instant, timeZone)
  const dayEndZoned = endOfDay(instantZoned)
  const dayEnd = zonedTimeToUtc(dayEndZoned, timeZone)
  return dayEnd
}

type WeekWithTimeZoneOptions = {
  timeZone: string
  instant: number
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

const startOfWeekWithTimeZone = (options: WeekWithTimeZoneOptions): Date => {
  const { timeZone, instant, weekStartsOn = 0 } = options
  const instantZoned = utcToZonedTime(instant, timeZone)
  const dayStartZoned = startOfWeek(instantZoned, { weekStartsOn })
  const dayStart = zonedTimeToUtc(dayStartZoned, timeZone)
  return dayStart
}

const endOfWeekWithTimeZone = (options: WeekWithTimeZoneOptions): Date => {
  const { timeZone, instant, weekStartsOn = 0 } = options
  const instantZoned = utcToZonedTime(instant, timeZone)
  const dayEndZoned = endOfWeek(instantZoned, { weekStartsOn })
  const dayEnd = zonedTimeToUtc(dayEndZoned, timeZone)
  return dayEnd
}

type MonthWithTimeZoneOptions = {
  timeZone: string
  instant: number
}

const startOfMonthWithTimeZone = (options: MonthWithTimeZoneOptions): Date => {
  const { timeZone, instant } = options
  const instantZoned = utcToZonedTime(instant, timeZone)
  const dayStartZoned = startOfMonth(instantZoned)
  const dayStart = zonedTimeToUtc(dayStartZoned, timeZone)
  return dayStart
}

const endOfMonthWithTimeZone = (options: MonthWithTimeZoneOptions): Date => {
  const { timeZone, instant } = options
  const instantZoned = utcToZonedTime(instant, timeZone)
  const dayEndZoned = endOfMonth(instantZoned)
  const dayEnd = zonedTimeToUtc(dayEndZoned, timeZone)
  return dayEnd
}

type EachDayOfIntervalWithTimeZoneOptions = {
  timeZone: string
  startDate: number
  endDate: number
}

const eachDayOfIntervalWithTimeZone = (
  options: EachDayOfIntervalWithTimeZoneOptions,
): Date[] => {
  const { timeZone, startDate, endDate } = options
  const startDateZoned = utcToZonedTime(startDate, timeZone)
  const endDateZoned = utcToZonedTime(endDate, timeZone)
  const dayListZoned = eachDayOfInterval({
    start: startDateZoned,
    end: endDateZoned,
  })
  const dayList = dayListZoned.map((dayZoned) =>
    zonedTimeToUtc(dayZoned, timeZone),
  )
  return dayList
}

export {
  startOfWeekWithTimeZone,
  endOfWeekWithTimeZone,
  startOfDayWithTimeZone,
  endOfDayWithTimeZone,
  startOfMonthWithTimeZone,
  endOfMonthWithTimeZone,
  eachDayOfIntervalWithTimeZone,
}
