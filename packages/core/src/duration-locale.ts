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

export { durationLocale }
