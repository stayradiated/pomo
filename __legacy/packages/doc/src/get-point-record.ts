import type { Doc, Point } from './types.js'

type GetOptions = {
  doc: Doc
}

const getPointRecord = (options: GetOptions): Record<string, Point> => {
  const { doc } = options

  const pointMap = doc.getMap('point')
  const pointRecord = pointMap.toJSON() as Record<string, Point>

  return pointRecord
}

export { getPointRecord }
