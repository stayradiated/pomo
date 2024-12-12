import { NotFoundError } from './error.js'
import type { Doc, Point } from './types.js'

type GetPointByIdOptions = {
  doc: Doc
  pointId: string
}

const getPointById = (options: GetPointByIdOptions): Point | Error => {
  const { doc, pointId } = options

  const pointMap = doc.getMap('point')
  const point = pointMap.get(pointId)
  if (!point) {
    return new NotFoundError(`No point with id ${pointId}`)
  }

  return point.toJSON() as Point
}

export { getPointById }
