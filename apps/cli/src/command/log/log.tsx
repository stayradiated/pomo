import { Box, render } from 'ink'
import React from 'react'
import {
  mapPointListToLineList,
  mapLineListToSliceList,
} from '@stayradiated/pomo-core'
import type { Doc } from '@stayradiated/pomo-doc'
import {
  retrievePointList,
  getStreamList,
  getLabelRecord,
} from '@stayradiated/pomo-doc'
import { MultiDaySliceList } from './multi-day-slice-list.js'

type HandlerOptions = {
  doc: Doc
  startDate: number
  endDate: number
  where: {
    streamId: string | undefined
  }
  timeZone: string
}

const renderLog = (options: HandlerOptions): void | Error => {
  const { doc, startDate, endDate, where, timeZone } = options

  const pointList = retrievePointList({
    doc,
    startDate,
    endDate,
    where,
  })

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  const sliceList = mapLineListToSliceList(lineList)
  if (sliceList instanceof Error) {
    return sliceList
  }

  const streamList = getStreamList({ doc })
  const labelRecord = getLabelRecord({ doc })

  render(
    <Box flexDirection="column" margin={1}>
      <MultiDaySliceList
        streamList={streamList}
        sliceList={sliceList}
        timeZone={timeZone}
        labelRecord={labelRecord}
      />
    </Box>,
  )

  return undefined
}

export { renderLog }
