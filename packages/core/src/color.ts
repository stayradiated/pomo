const getColorContrast = (hexcolor: string): number => {
  // If a leading # is provided, remove it
  if (hexcolor.startsWith('#')) {
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
  const r = Number.parseInt(hexcolor.slice(0, 2), 16)
  const g = Number.parseInt(hexcolor.slice(2, 4), 16)
  const b = Number.parseInt(hexcolor.slice(4, 6), 16)

  // Get YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  return Math.max(0, Math.min(1, yiq / 256))
}

export { getColorContrast }
