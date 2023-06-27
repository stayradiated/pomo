import React from 'react'
import { render, Box, Text } from 'ink'
import type { Doc, Label } from '@stayradiated/pomo-doc'
import {
  getLabelList,
  getPointList,
  getStreamRecord,
} from '@stayradiated/pomo-doc'
import { LabelTable } from './label-table.js'

type ListLabelsOptions = {
  doc: Doc
  streamId?: string
}

const listLabels = (options: ListLabelsOptions): void | Error => {
  const { doc } = options
  const labelList = getLabelList({ doc })
  const pointList = getPointList({ doc })
  const streamRecord = getStreamRecord({ doc })

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
      const aCount = labelCountMap.get(a.id) ?? 0
      const bCount = labelCountMap.get(b.id) ?? 0
      return bCount - aCount
    })

    const stream = streamRecord[streamId]
    if (!stream) {
      return new Error(`Stream not found: ${streamId}`)
    }

    const streamName = stream.name

    children.push(
      <>
        <Box padding={1}>
          <Text bold underline>
            {streamName}
          </Text>
        </Box>
        <LabelTable
          key={streamId}
          labelList={streamLabelList}
          labelCountMap={labelCountMap}
        />
      </>,
    )
  }

  render(<>{children}</>)
}

export { listLabels }
