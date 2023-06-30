const formatDuration = (ms: number): string => {
  const hours = Math.floor(ms / 1000 / 60 / 60)
  const minutes = Math.floor(ms / 1000 / 60) % 60
  const seconds = Math.floor(ms / 1000) % 60

  const h = hours > 0 ? `${hours}h ` : ''
  const m = minutes > 0 ? `${minutes}m ` : ''
  const s = hours === 0 && minutes === 0 ? `${seconds}s` : ''

  return `${h}${m}${s}`
}

export { formatDuration }
