import type { Doc, Label } from '@stayradiated/pomo-doc'
import {
  getLabelRecord,
  getPointList,
  getStreamRecord,
} from '@stayradiated/pomo-doc'
import { Box, Text, render } from 'ink'
import type React from 'react'
import { Fragment } from 'react'
import { LabelTable } from './label-table.js'

type ListLabelsOptions = {
  doc: Doc
  streamId?: string
}

const listLabelsAsTable = (options: ListLabelsOptions): undefined | Error => {
  const { doc, streamId: whereStreamId } = options

  const streamRecord = getStreamRecord({ doc })
  const labelRecord = getLabelRecord({ doc })
  const allPointList = getPointList({ doc })

  const allLabelList = Object.values(labelRecord)
  const labelList = whereStreamId
    ? allLabelList.filter((label) => label.streamId === whereStreamId)
    : allLabelList

  const pointList = whereStreamId
    ? allPointList.filter((point) => point.streamId === whereStreamId)
    : allPointList

  const labelCountMap = new Map<string, number>()
  for (const point of pointList) {
    for (const labelId of point.labelIdList) {
      const count = labelCountMap.get(labelId) ?? 0
      labelCountMap.set(labelId, count + 1)
    }
  }

  const lableByStreamId = new Map<string, Label[]>()
  for (const label of labelList) {
    const streamId = label.streamId
    const labelList = lableByStreamId.get(streamId) ?? []
    labelList.push(label)
    lableByStreamId.set(streamId, labelList)
  }

  const children: React.ReactNode[] = []

  for (const [streamId, streamLabelList] of lableByStreamId.entries()) {
    streamLabelList.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })

    const stream = streamRecord[streamId]
    if (!stream) {
      return new Error(`Stream not found: ${streamId}`)
    }

    const streamName = stream.name

    children.push(
      <Fragment key={streamId}>
        <Box paddingY={1}>
          <Text># </Text>
          <Text bold underline>
            {streamName}
          </Text>
        </Box>
        <LabelTable
          key={streamId}
          labelList={streamLabelList}
          labelCountMap={labelCountMap}
          allLabelRecord={labelRecord}
        />
      </Fragment>,
    )
  }

  render(children)
}

export { listLabelsAsTable }
