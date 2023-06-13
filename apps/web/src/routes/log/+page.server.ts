import { error } from '@sveltejs/kit'
import { db } from '$lib/data.js'
import { mapPointListToLineList, mapLineListToSliceList } from '@stayradiated/pomo-core'
import { retrieveStreamList, retrievePointList } from "@stayradiated/pomo-db"
import type { PageServerLoad } from './$types';
import type { Slice } from '@stayradiated/pomo-core';

type FilterSlicesByValueOptions = {
  sliceList: Slice[],
  streamId: string,
  value: string,
}

const filterSlicesByValue = (options: FilterSlicesByValueOptions): Slice[] => {
  const { sliceList, streamId, value } = options
  const result =  sliceList.reduce<{
    insideStream: boolean
    output: Slice[]
  }>((acc, slice) => {
    const streamLine = slice.lineList.find((line) => line.streamId === streamId)
    if (streamLine) {
      acc.insideStream = streamLine.value.toLowerCase().includes(value.toLowerCase())
    }

    if (!acc.insideStream) {
      return acc
    }

    acc.output.push(slice)
    return acc
  }, {
    insideStream: false,
    output: [],
  })
  return result.output
}

const load = (async ({ request }) => {
  const url = new URL(request.url)
  const filterStreamId = url.searchParams.get('stream') ?? undefined
  const filterValue = url.searchParams.get('value') ?? undefined

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

  const shouldFilterSliceList = (typeof filterValue !== 'undefined' && typeof filterStreamId !== 'undefined')
  const filteredSliceList = shouldFilterSliceList
    ? filterSlicesByValue({ sliceList, streamId: filterStreamId, value: filterValue })
    : sliceList

  // display most recent first
  filteredSliceList.reverse()

  return {
    pointList,
    sliceList: filteredSliceList,
    streamList,
    filterStreamId,
    filterValue
  }
}) satisfies PageServerLoad;

export { load }
