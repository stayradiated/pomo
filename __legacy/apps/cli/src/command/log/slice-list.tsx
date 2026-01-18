import { durationLocale } from '@stayradiated/pomo-core'
import type { Slice } from '@stayradiated/pomo-core'
import type { Label, Stream } from '@stayradiated/pomo-doc'
import * as dateFns from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Newline, Text } from 'ink'
import React from 'react'
import { FlexTable } from '#src/components/flex-table.js'
import type { Cell, Column, Row } from '#src/components/flex-table.js'

type SliceListProps = {
  streamList: Stream[]
  sliceList: Slice[]
  timeZone: string
  labelRecord: Record<string, Label>
}

const SliceList = (props: SliceListProps) => {
  const { streamList, sliceList, timeZone, labelRecord } = props

  const columns: Column[] = [
    {
      name: 'id',
      color: 'white',
      flexShrink: 0,
    },
    {
      name: 'time',
      color: 'green',
      flexShrink: 0,
    },
    ...streamList.map((stream) => ({
      name: stream.name,
    })),
  ]

  const rows = sliceList.map((slice) => {
    const { lineList, startedAt: startedAtUTC } = slice

    const startedAt = toZonedTime(startedAtUTC, timeZone)

    const cells: Cell[] = [
      {
        content: lineList[0]?.id.slice(0, 10),
        width: 10,
      },
      {
        content: dateFns.format(startedAt, 'HH:mm'),
        width: 5,
      },
      ...streamList.map((stream) => {
        const line = lineList.find((line) => line.streamId === stream.id)
        if (!line) {
          return {
            content: '',
            width: 0,
          }
        }

        const duration = dateFns.formatDuration(
          dateFns.intervalToDuration({ start: 0, end: line.durationMs }),
          {
            format: ['hours', 'minutes', 'seconds'],
            locale: durationLocale,
          },
        )

        const text = line.labelIdList
          .map((labelId) => labelRecord[labelId]?.name)
          .join(', ')

        const content = (
          <React.Fragment key={stream.id}>
            {text}
            <Newline />
            <Text color="blueBright">{duration}</Text>
          </React.Fragment>
        )

        return {
          content,
          width: text.length,
        }
      }),
    ]

    const row: Row = {
      cells,
    }

    return row
  })

  return <FlexTable rows={rows} columns={columns} />
}

export { SliceList }
export type { SliceListProps }
