import { startOfDay } from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

type StartOfDayWithTimeZoneOptions = {
  timeZone: string
  instant: number
}

const startOfDayWithTimeZone = (
  options: StartOfDayWithTimeZoneOptions,
): Date => {
  const { timeZone, instant } = options
  const instantZoned = utcToZonedTime(instant, timeZone)
  const dayStartZoned = startOfDay(instantZoned)
  const dayStart = zonedTimeToUtc(dayStartZoned, timeZone)
  return dayStart
}

export { startOfDayWithTimeZone }
