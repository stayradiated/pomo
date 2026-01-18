const formatDurationHMS = (durationMs: number): string => {
  const hours = Math.floor(durationMs / 1000 / 60 / 60)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((durationMs / 1000 / 60) % 60)
    .toString()
    .padStart(2, '0')
  const seconds = Math.round((durationMs / 1000) % 60)
    .toString()
    .padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const formatDurationRough = (durationMs: number): string => {
  // Over 48 hours, show number of days to 1 decimal place
  // over 1 hour, show hours and minutes
  // over 1 minute, show minutes
  // otherwise, show "< 1 min"

  const days = durationMs / 1000 / 60 / 60 / 24
  if (days > 2) {
    const daysRounded = Math.round(days * 10) / 10
    return `${daysRounded}d`
  }

  const hours = Math.floor(durationMs / 1000 / 60 / 60)
  const minutes = Math.floor((durationMs / 1000 / 60) % 60)
  if (hours >= 1) {
    if (minutes === 0) {
      return `${hours}h`
    }

    return `${hours}h ${minutes}m`
  }

  if (minutes >= 1) {
    return `${minutes}m`
  }

  return '<1m'
}

export { formatDurationHMS, formatDurationRough }
