import React from 'react'
import { Text } from 'ink'
import type { Label } from '@stayradiated/pomo-doc'
import { getColorContrast } from '@stayradiated/pomo-core'
import { FlexTable } from '#src/components/flex-table.js'
import type { Cell, Row, Column } from '#src/components/flex-table.js'

type LabelTableProps = {
  labelList: Label[]
  labelCountMap: Map<string, number>

  allLabelRecord: Record<string, Label>
}

const LabelTable = (props: LabelTableProps) => {
  const { labelList, labelCountMap, allLabelRecord } = props

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
      name: 'Parent',
      color: 'cyan',
    },
    {
      name: 'Color',
      flexShrink: 0,
    },
    {
      name: 'Count',
      color: 'green',
      flexShrink: 0,
    },
    {
      name: 'Icon',
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

    const parentLabel =
      typeof label.parentId === 'string'
        ? allLabelRecord[label.parentId]
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
        content: parentLabel?.name ?? '',
        width: parentLabel?.name.length ?? 0,
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
      {
        content: label.icon,
        width: 8,
      },
    ]
    return { cells }
  })

  return <FlexTable columns={columns} rows={rows} />
}

export { LabelTable }
