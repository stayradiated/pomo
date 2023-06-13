import { error } from '@sveltejs/kit'
import { db } from '$lib/data.js'
import { mapPointListToLineList, mapLineListToSliceList } from '@stayradiated/pomo-core'
import { retrieveStreamList, retrievePointList } from "@stayradiated/pomo-db"

const load = async () => {
  const streamList = await retrieveStreamList({ db })

  const pointList = await retrievePointList({
    db,
    since: new Date('2023-06-01'),
    filter: {}
  })
  if (pointList instanceof Error) {
    throw error(500, pointList)
  }

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    throw error(500, lineList)
  }

  const sliceList = mapLineListToSliceList(lineList)
  if (sliceList instanceof Error) {
    throw error(500, sliceList)
  }

  // display most recent first
  sliceList.reverse()

  return {
    pointList,
    sliceList,
    streamList,
  }
}

export { load }
