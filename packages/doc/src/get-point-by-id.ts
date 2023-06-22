import type { Point } from '@stayradiated/pomo-core'
import type { AutomergeDoc } from './types.js'

type GetPointByIdOptions = {
  doc: AutomergeDoc
  id: string
}

const getPointById = (options: GetPointByIdOptions): Point | undefined => {
  const { doc, id } = options
  const point = doc.point[id]
  return point
}

export { getPointById }
