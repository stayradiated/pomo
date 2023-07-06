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

export { formatDurationHMS }
