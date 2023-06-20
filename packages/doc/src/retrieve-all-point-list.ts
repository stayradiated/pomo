import type { Point } from '@stayradiated/pomo-core'
import type { AutomergeDoc } from './types.js'

type RetrieveOptions = {
  doc: AutomergeDoc
}

const retrieveAllPointList = async (
  options: RetrieveOptions,
): Promise<Point[]> => {
  const { doc } = options

  const pointList = Object.values(doc.point)

  return pointList
}

export { retrieveAllPointList }
