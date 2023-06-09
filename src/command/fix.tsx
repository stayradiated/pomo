import { Text, Box } from 'ink'
import React from 'react'
import type { Selectable } from 'kysely'
import type { KyselyDb, Stream, Point } from '#src/core/db.js'
import { format, startOfDay } from 'date-fns'
import { getStreamIdByName } from '#src/core/get-stream-id-by-name.js'
import { mapLineListToSliceList } from '#src/core/slice.js'
import { mapPointListToLineList } from '#src/core/line.js'
import { render } from 'ink'
import { retrievePointList } from '#src/core/retrieve-point-list.js'
import { stripComments } from '#src/core/text.js'
import type { Slice } from '#src/core/slice.js'

type PartialPoint = Pick<Selectable<Point>, 'id' | 'streamId' | 'value'>

type SliceListProps = {
  streamList: Pick<Selectable<Stream>, 'id' | 'name'>[],
  sliceList: Slice[]
  pointList: PartialPoint[]
}

const SliceList = (props: SliceListProps) => {
  const { streamList, sliceList, pointList } = props

  const pointsByStreamId = pointList.reduce<Map<number, PartialPoint[]>>((acc, point) => {
    const { streamId } = point
    const list: PartialPoint[] = acc.get(streamId) ?? []
    list.push(point)
    acc.set(streamId, list)
    return acc
  }, new Map())

  // calculate max length of value for each stream
  const maxLengthByStreamId = [...pointsByStreamId.entries()].reduce<Map<number, number>>((acc, [streamId, list]) => {
    const stream = streamList.find((stream) => stream.id === streamId)
    if (!stream) {
      throw new Error(`stream not found for id ${streamId}`)
    }

    const maxLength = list.reduce((acc, point) => {
      const { value } = point
      return Math.max(acc, stripComments(value).length)
    }, stream.name.length)
    acc.set(streamId, maxLength)
    return acc
  }, new Map())

  return (
    <>
      <Box columnGap={1}>
        <Box flexBasis={5} flexShrink={0}>
          <Text color='magenta'>time</Text>
        </Box>
        {streamList.map((stream, index) => {
          const basis = maxLengthByStreamId.get(stream.id) ?? 0
          return (
            <Box key={index} flexBasis={basis}>
              <Text color='magenta'>{stream.name}</Text>
            </Box>
          )
      })}
      </Box>
      {sliceList.map((slice, index) => {
        const { lineList, startedAt } = slice
        return (
          <Box key={index} columnGap={1}>
            <Box flexBasis={5} flexShrink={0}>
              <Text color='green'>{format(startedAt, 'HH:mm')}</Text>
            </Box>

            {streamList.map((stream, index) => {
              const basis = maxLengthByStreamId.get(stream.id) ?? 0

              const line = lineList.find((line) => line.streamId === stream.id)
              if (!line) {
                return <Box key={index} flexBasis={basis} />
              }

              return (
                <Box key={index} flexBasis={basis}>
                  <Text>{stripComments(line.value)}</Text>
                </Box>
              )
            })}
          </Box>
        )
      })}
    </>
  )
}

const MultiDaySliceList = (props: SliceListProps) => {
  const { sliceList, streamList, pointList } = props

  const sliceListByDay = sliceList.reduce<Map<string, Slice[]>>((acc, slice) => {
    // format as Friday 02 June 2023 
    const day = format(slice.startedAt, 'EEEE dd MMMM yyyy')
    const list: Slice[] = acc.get(day) ?? []
    list.push(slice)
    acc.set(day, list)
    return acc
  }, new Map())

  return (
    <>
      {Array.from(sliceListByDay.entries()).map(([day, sliceList], index) => {
        return (
          <Box key={index} flexDirection='column' marginBottom={1}>
            <Text color='#888'>{day}</Text>
            <SliceList
              streamList={streamList}
              sliceList={sliceList}
              pointList={pointList}
            />
          </Box>
        )
      })}
    </>
  )
}

type FixCmdOptions = {
  db: KyselyDb
  currentTime: Date
}

const fixCmd = async (options: FixCmdOptions) => {
  const { db, currentTime } = options

  const pointList = await retrievePointList({
    db,
    since: startOfDay(currentTime),
    filter: {},
  })
  if (pointList instanceof Error) {
    return pointList
  }

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  const sliceList = mapLineListToSliceList(lineList)
  if (sliceList instanceof Error) {
    return sliceList
  }

  const streamList = await Promise.all(
    ['country', 'location', 'project', 'task'].map(async (name) => {
      const id = await getStreamIdByName({ db, name })
      if (id instanceof Error) {
        throw id
      }

      return {
        id,
        name,
      }
    }),
  )

  render(<Box flexDirection='column' margin={1}>
    <MultiDaySliceList 
      streamList={streamList}
      pointList={pointList}
      sliceList={sliceList}
    />
  </Box>)

  return undefined
}

export { fixCmd }
