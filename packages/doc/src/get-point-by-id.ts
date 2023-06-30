import type { Doc, Point } from './types.js'

type GetPointByIdOptions = {
  doc: Doc
  pointId: string
}

const getPointById = (options: GetPointByIdOptions): Point | undefined => {
  const { doc, pointId } = options

  const pointMap = doc.getMap('point')
  const point = pointMap.get(pointId)
  if (!point) {
    return undefined
  }

  return point.toJSON() as Point
}

export { getPointById }
