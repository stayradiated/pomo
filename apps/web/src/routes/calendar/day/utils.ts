const formatDuration = (ms: number): string => {
  const hours = Math.floor(ms / 1000 / 60 / 60)
  const minutes = Math.floor(ms / 1000 / 60) % 60
  const seconds = Math.floor(ms / 1000) % 60

  const h = hours > 0 ? `${hours}h ` : ''
  const m = minutes > 0 ? `${minutes}m ` : ''
  const s = seconds > 0 ? `${seconds}s` : ''

  return `${h}${m}${s}`
}

const getColorContrast = (hexcolor: string): number => {
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === '#') {
    hexcolor = hexcolor.slice(1)
  }

  // If a three-character hexcode, make six-character
  if (hexcolor.length === 3) {
    hexcolor = hexcolor
      .split('')
      .map(function (hex) {
        return hex + hex
      })
      .join('')
  }

  // Convert to RGB value
  const r = parseInt(hexcolor.slice(0, 2), 16)
  const g = parseInt(hexcolor.slice(2, 4), 16)
  const b = parseInt(hexcolor.slice(4, 6), 16)

  // Get YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  return Math.max(0, Math.min(1, yiq / 256))
}

export { formatDuration, getColorContrast }
