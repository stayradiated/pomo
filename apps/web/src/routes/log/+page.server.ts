import { error } from '@sveltejs/kit'
import { getDoc } from '$lib/doc.js'
import {
  mapPointListToLineList,
  mapLineListToSliceList,
} from '@stayradiated/pomo-core'
import {
  getLabelRecord,
  getStreamList,
  retrievePointList,
  getUserTimeZone,
} from '@stayradiated/pomo-doc'
import type { PageServerLoad, Actions } from './$types'
import type { Slice } from '@stayradiated/pomo-core'
import { redirect } from '@sveltejs/kit'
import { zfd } from 'zod-form-data'
import { z } from 'zod'

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

const load = (async ({ request }) => {
  const url = new URL(request.url)
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
    startDate: new Date('2023-06-17').getTime(),
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

const $schema = zfd.formData({
  stream: zfd.text(z.string().length(36)),
  label: zfd.text(z.string().length(36)),
})

const actions = {
  default: async ({ request }) => {
    const formData = $schema.parse(await request.formData())
    const { stream, label } = formData

    const url = new URL(request.url)
    url.searchParams.set('stream', stream)
    url.searchParams.set('label', label)

    throw redirect(303, url.toString())
  },
} satisfies Actions

export { load, actions }
