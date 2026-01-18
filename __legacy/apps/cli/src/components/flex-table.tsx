import { Box, Text, type TextProps } from 'ink'
import type React from 'react'

type Column = {
  name: string
  color?: TextProps['color']
  flexShrink?: number
}

type Cell = {
  width: number
  content: React.ReactNode
}

type Row = {
  cells: Cell[]
}

type FlexTableProps = {
  columns: Column[]
  rows: Row[]
}

const calculateColumnWidths = (columns: Column[], rows: Row[]): number[] => {
  const columnWidths = columns.map((column) => column.name.length)

  for (const row of rows) {
    for (const [index, cell] of row.cells.entries()) {
      const width = cell.width
      const currentWidth = columnWidths[index] ?? 0

      if (width > currentWidth) {
        columnWidths[index] = width
      }
    }
  }

  return columnWidths
}

const FlexTable = (props: FlexTableProps) => {
  const { columns, rows } = props

  const columnWidths = calculateColumnWidths(columns, rows)

  return (
    <>
      <Box columnGap={1}>
        {columns.map((column, index) => {
          const basis = columnWidths[index]

          return (
            <Box key={index} flexBasis={basis}>
              <Text color="magentaBright">{column.name}</Text>
            </Box>
          )
        })}
      </Box>

      {rows.map((row, index) => {
        return (
          <Box key={index} columnGap={1}>
            {columns.map((column, index) => {
              const basis = columnWidths[index]
              const cell = row.cells[index]

              return (
                <Box
                  key={index}
                  flexBasis={basis}
                  flexShrink={column.flexShrink}
                >
                  <Text color={column.color}>{cell?.content}</Text>
                </Box>
              )
            })}
          </Box>
        )
      })}
    </>
  )
}

export { FlexTable }
export type { FlexTableProps, Cell, Column, Row }
