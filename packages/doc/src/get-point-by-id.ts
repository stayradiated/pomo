import type { Point } from '@stayradiated/pomo-core'
import type { AutomergeDoc } from './types.js'

type GetPointByIdOptions = {
  doc: AutomergeDoc
  id: string
}

const getPointById = async (
  options: GetPointByIdOptions,
): Promise<Point | Error> => {
  const { doc, id } = options
  const point = doc.point[id]
  if (!point) {
    return new Error(`Point not found: ${id}`)
  }

  return point
}

export { getPointById }
