import { colord, extend } from 'colord'
import type { Plugin, RgbColor } from 'colord'
import a11yPlugin from 'colord/plugins/a11y'

extend([a11yPlugin as unknown as Plugin])

const getColorContrast = (hexcolor: string): number => {
  return colord(hexcolor).isReadable() ? 0 : 1
}

type UiColor = {
  colorBg: string
  colorFg: string
  colorOp: string
}

const triplet = (rgbColor: RgbColor): string => {
  return `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}`
}

const getUiColor = (colorBg = 'white'): UiColor => {
  const contrast = getColorContrast(colorBg)

  return {
    colorBg: triplet(colord(colorBg).toRgb()),
    colorFg: triplet(colord(contrast >= 0.5 ? '#000' : '#fff').toRgb()),
    colorOp: triplet(colord(contrast >= 0.5 ? '#fff' : '#000').toRgb()),
  }
}

export { getColorContrast, getUiColor }
