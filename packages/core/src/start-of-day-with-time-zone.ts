import { startOfDay } from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

const startOfDayWithTimeZone = (input: number, timeZone: string): Date => {
  const inputZoned = utcToZonedTime(input, timeZone)
  const dayStartZoned = startOfDay(inputZoned)
  const dayStart = zonedTimeToUtc(dayStartZoned, timeZone)
  return dayStart
}

export { startOfDayWithTimeZone }
