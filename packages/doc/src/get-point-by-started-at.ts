import type { Doc, Point } from './types.js'
import { find } from './utils/find.js'
import { NotFoundError } from './error.js'

type GetPointByStartedAtOptions = {
  doc: Doc
  streamId: string
  startedAt: number
}

const getPointByStartedAt = (
  options: GetPointByStartedAtOptions,
): Point | Error => {
  const { doc, streamId, startedAt } = options

  const pointMap = doc.getMap('point')

  const existingPoint = find(
    pointMap.values(),
    (point) =>
      point.get('streamId') === streamId &&
      point.get('startedAt') === startedAt,
  )

  if (!existingPoint) {
    return new NotFoundError(
      `Point not found for streamId ${streamId} and startedAt ${startedAt}`,
    )
  }

  return existingPoint.toJSON() as Point
}

export { getPointByStartedAt }
