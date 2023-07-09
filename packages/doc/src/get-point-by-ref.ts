import type { Doc, Point } from './types.js'
import { NotFoundError, MultipleFoundError } from './error.js'

type GetPointByRefOptions = {
  doc: Doc
  ref: string
}

const getPointByRef = (options: GetPointByRefOptions): Point | Error => {
  const { doc, ref } = options

  const pointMap = doc.getMap('point')

  const pointIdList = Array.from(pointMap.keys()).filter((pointId) => {
    return pointId.startsWith(ref)
  })

  const pointId = pointIdList[0]
  const row = pointId && pointMap.get(pointId)
  if (!row) {
    return new NotFoundError(`No point with ref ${ref}`)
  }

  if (pointIdList.length > 1) {
    return new MultipleFoundError(`Multiple points with ref ${ref}`)
  }

  return row.toJSON() as Point
}

export { getPointByRef }
