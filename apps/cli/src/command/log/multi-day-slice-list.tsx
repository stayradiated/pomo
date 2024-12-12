import type { Slice } from '@stayradiated/pomo-core'
import * as dateFns from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Box, Text } from 'ink'
import React from 'react'
import { SliceList } from './slice-list.js'
import type { SliceListProps } from './slice-list.js'

type MultiDaySliceListProps = SliceListProps

const MultiDaySliceList = (props: MultiDaySliceListProps) => {
  const { sliceList, timeZone } = props

  const sliceListByDay = sliceList.reduce<Map<string, Slice[]>>(
    (acc, slice) => {
      const { startedAt: startedAtUTC } = slice
      const startedAt = toZonedTime(startedAtUTC, timeZone)

      // Format as Friday 02 June 2023
      const day = dateFns.format(startedAt, 'EEEE dd MMMM yyyy')
      const list: Slice[] = acc.get(day) ?? []
      list.push(slice)
      acc.set(day, list)
      return acc
    },
    new Map(),
  )

  return (
    <>
      {Array.from(sliceListByDay.entries()).map(([day, sliceList]) => {
        return (
          <Box key={day} flexDirection="column" marginBottom={1}>
            <Text color="#888">{day}</Text>
            <SliceList {...props} sliceList={sliceList} />
          </Box>
        )
      })}
    </>
  )
}

export { MultiDaySliceList }
export type { MultiDaySliceListProps }
