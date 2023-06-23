import type { Doc, Point } from './types.js'

type GetPointByIdOptions = {
  doc: Doc
  id: string
}

const getPointById = (options: GetPointByIdOptions): Point | undefined => {
  const { doc, id } = options

  const pointMap = doc.getMap('point')
  const point = pointMap.get(id)
  if (!point) {
    return undefined
  }

  return point.toJSON() as Point
}

export { getPointById }
