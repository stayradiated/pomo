import type { Doc, Point } from './types.js'

type RetrieveOptions = {
  doc: Doc
}

const retrieveAllPointList = (options: RetrieveOptions): Point[] => {
  const { doc } = options

  const pointMap = doc.getMap('point')
  const pointList = Object.values(pointMap.toJSON()) as Point[]

  return pointList
}

export { retrieveAllPointList }
