import React from 'react'
import type { Label } from '@stayradiated/pomo-doc'
import { FlexTable } from '#src/components/flex-table.js'
import type { Cell, Row, Column } from '#src/components/flex-table.js'

type LabelTableProps = {
  labelList: Label[]
  labelCountMap: Map<string, number>
}

const LabelTable = (props: LabelTableProps) => {
  const { labelList, labelCountMap } = props

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
      name: 'Count',
      color: 'green',
      flexShrink: 0,
    },
  ]

  const rows: Row[] = labelList.map((label) => {
    const count = labelCountMap.get(label.id) ?? 0
    const cells: Cell[] = [
      {
        content: label.id.slice(0, 7),
        width: 7,
      },
      {
        content: label.name,
        width: label.name.length,
      },
      {
        content: count,
        width: 5,
      },
    ]
    return { cells }
  })

  return <FlexTable columns={columns} rows={rows} />
}

export { LabelTable }
