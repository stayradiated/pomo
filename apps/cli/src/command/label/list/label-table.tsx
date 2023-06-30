import React from 'react'
import { Text } from 'ink'
import type { Label } from '@stayradiated/pomo-doc'
import { getColorContrast } from '@stayradiated/pomo-core'
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
      name: 'Color',
    },
    {
      name: 'Count',
      color: 'green',
      flexShrink: 0,
    },
  ]

  const rows: Row[] = labelList.map((label) => {
    const count = labelCountMap.get(label.id) ?? 0

    const backgroundColor = label.color ?? undefined
    const color = label.color
      ? getColorContrast(label.color)
        ? '#ffffff'
        : '#000000'
      : undefined

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
        content: (
          <Text backgroundColor={backgroundColor} color={color}>
            {label.color}
          </Text>
        ),
        width: label.color?.length ?? 0,
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
