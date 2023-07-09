import { error } from '@sveltejs/kit'
import { getDoc } from '$lib/doc.js'
import {
  mapPointListToLineList,
  mapLineListToSliceList,
  startOfDayWithTimeZone,
} from '@stayradiated/pomo-core'
import {
  getLabelRecord,
  getStreamList,
  retrievePointList,
  getUserTimeZone,
} from '@stayradiated/pomo-doc'
import type { PageServerLoad } from './$types'
import type { Slice } from '@stayradiated/pomo-core'
import * as dateFns from 'date-fns'

type FilterSlicesByValueOptions = {
  sliceList: Slice[]
  streamId: string
  labelId: string
}

const filterSlicesByValue = (options: FilterSlicesByValueOptions): Slice[] => {
  const { sliceList, streamId, labelId } = options
  const result = sliceList.reduce<{
    insideStream: boolean
    output: Slice[]
  }>(
    (acc, slice) => {
      const streamLine = slice.lineList.find(
        (line) => line.streamId === streamId,
      )
      if (streamLine) {
        acc.insideStream = streamLine.labelIdList.includes(labelId)
      }

      if (!acc.insideStream) {
        return acc
      }

      acc.output.push(slice)
      return acc
    },
    {
      insideStream: false,
      output: [],
    },
  )
  return result.output
}

const load = (async ({ url }) => {
  const filterStreamId = url.searchParams.get('stream') ?? undefined
  const filterLabelId = url.searchParams.get('label') ?? undefined

  const doc = await getDoc()
  if (doc instanceof Error) {
    throw error(500, doc.message)
  }

  const timeZone = getUserTimeZone({ doc })

  const streamList = getStreamList({ doc })
  const labelRecord = getLabelRecord({ doc })

  const pointList = retrievePointList({
    doc,
    startDate: startOfDayWithTimeZone({
      instant: dateFns.subDays(Date.now(), 7).getTime(),
      timeZone,
    }).getTime(),
    endDate: Date.now(),
    where: {},
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

  const shouldFilterSliceList =
    typeof filterLabelId !== 'undefined' &&
    typeof filterStreamId !== 'undefined'
  const filteredSliceList = shouldFilterSliceList
    ? filterSlicesByValue({
        sliceList,
        streamId: filterStreamId,
        labelId: filterLabelId,
      })
    : sliceList

  // display most recent first
  filteredSliceList.reverse()

  return {
    pointList,
    sliceList: filteredSliceList,
    streamList,
    labelRecord,
    filterStreamId,
    filterLabelId,
    timeZone,
  }
}) satisfies PageServerLoad

export { load }
