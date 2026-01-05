import * as dateFns from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const formatDistanceLocale: Record<string, string> = {
  xSeconds: '{{count}}s',
  xMinutes: '{{count}}m',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  xMonths: '{{count}}mo',
}

const durationLocale = {
  formatDistance(token: string, count: number) {
    return (
      formatDistanceLocale[token]?.replace('{{count}}', String(count)) ??
      `[[${token}=${count}]]`
    )
  },
}

const formatTime = (timeZone: string, utc: number): string => {
  const time = toZonedTime(utc, timeZone)
  return dateFns.format(time, 'HH:mm')
}

const formatDuration = (ms: number): string => {
  return (
    dateFns.formatDuration(dateFns.intervalToDuration({ start: 0, end: ms }), {
      format: ['hours', 'minutes'],
      locale: durationLocale,
    }) || 'now'
  )
}

export { formatTime, formatDuration }
