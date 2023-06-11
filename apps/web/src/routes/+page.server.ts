import { error } from '@sveltejs/kit'
import { streamList, pointList } from './data.js'
import { mapPointListToLineList, mapLineListToSliceList } from '@stayradiated/pomo-core'

const load = () => {
  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    throw error(500, lineList)
  }

  const sliceList = mapLineListToSliceList(lineList)
  if (sliceList instanceof Error) {
    throw error(500, sliceList)
  }

  return {
    pointList,
    sliceList,
    streamList,
  }
}

export { load }
