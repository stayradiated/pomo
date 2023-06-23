import { error } from '@sveltejs/kit'
import { getDoc } from '$lib/doc.js'
import { mapPointListToLineList, mapLineListToSliceList } from '@stayradiated/pomo-core'
import { retrieveStreamList, retrievePointList, getUserTimeZone } from "@stayradiated/pomo-doc"
import type { PageServerLoad, Actions } from './$types';
import type { Slice } from '@stayradiated/pomo-core';
import { redirect } from '@sveltejs/kit';
import { zfd } from 'zod-form-data'
import { z } from 'zod'
import { cloneList } from '$lib/clone.js'

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

  const doc = await getDoc()
  if (doc instanceof Error) {
    throw error(500, doc.message)
  }

  const timeZone = getUserTimeZone({ doc })

  const streamList = retrieveStreamList({ doc })

  const pointList = retrievePointList({
    doc,
    since: new Date('2023-06-17').getTime(),
    where: {}
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
    pointList: cloneList(pointList),
    sliceList: filteredSliceList,
    streamList: cloneList(streamList),
    filterStreamId,
    filterValue,
    timeZone,
  }
}) satisfies PageServerLoad;

const $schema = zfd.formData({
  stream: zfd.text(z.string().length(36)),
  value: zfd.text(z.string().min(1)),
});

const actions = {
  default: async ({ request }) => {
    const formData = $schema.parse(await request.formData())
    const { stream, value } = formData

    const url = new URL(request.url)
    url.searchParams.set('stream', stream)
    url.searchParams.set('value', value)

    throw redirect(303, url.toString())
  }
} satisfies Actions;

export { load, actions }
