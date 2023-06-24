import { startOfWeek } from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

type StartOfWeekWithTimeZoneOptions = {
  timeZone: string
  instant: number
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

const startOfWeekWithTimeZone = (
  options: StartOfWeekWithTimeZoneOptions,
): Date => {
  const { timeZone, instant, weekStartsOn = 0 } = options
  const instantZoned = utcToZonedTime(instant, timeZone)
  const dayStartZoned = startOfWeek(instantZoned, { weekStartsOn })
  const dayStart = zonedTimeToUtc(dayStartZoned, timeZone)
  return dayStart
}

export { startOfWeekWithTimeZone }
