import type { Doc, Point } from './types.js'

type GetPointListOptions = {
  doc: Doc
}

const getPointList = (options: GetPointListOptions): Point[] => {
  const { doc } = options

  const pointMap = doc.getMap('point')
  const pointList = Object.values(pointMap.toJSON()) as Point[]

  return pointList
}

export { getPointList }
