import React from 'react'
import type { Stream } from '@stayradiated/pomo-doc'
import { FlexTable } from '#src/components/flex-table.js'
import type { Cell, Row, Column } from '#src/components/flex-table.js'

type StreamTableProps = {
  streamList: Stream[]
}

const StreamTable = (props: StreamTableProps) => {
  const { streamList } = props

  const columns: Column[] = [
    {
      name: 'id',
      color: 'magenta',
      flexShrink: 0,
    },
    {
      name: 'Name',
    },
    {
      name: 'Index',
      color: 'green',
      flexShrink: 0,
    },
  ]

  const rows: Row[] = streamList.map((stream) => {
    const cells: Cell[] = [
      {
        content: stream.id.slice(0, 7),
        width: 7,
      },
      {
        content: stream.name,
        width: stream.name.length,
      },
      {
        content: stream.index,
        width: 5,
      },
    ]
    return { cells }
  })

  return <FlexTable columns={columns} rows={rows} />
}

export { StreamTable }
