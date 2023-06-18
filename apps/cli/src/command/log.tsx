import * as chrono from 'chrono-node'
import { getStreamIdByName, retrievePointList } from '@stayradiated/pomo-db'
import { Text, Box, Newline, render } from 'ink'
import React from 'react'
import { format, startOfDay } from 'date-fns'
import {
  mapPointListToLineList,
  mapLineListToSliceList,
  stripComments,
  firstLine,
} from '@stayradiated/pomo-core'
import type { Slice, Stream, Point } from '@stayradiated/pomo-core'
import type { KyselyDb } from '@stayradiated/pomo-db'
import { CliCommand } from 'cilly'
import { getDb } from '#src/lib/db.js'

type SliceListProps = {
  streamList: Stream[]
  sliceList: Slice[]
  pointList: Point[]
}

const SliceList = (props: SliceListProps) => {
  const { streamList, sliceList, pointList } = props

  const pointsByStreamId = pointList.reduce<Map<string, Point[]>>(
    (acc, point) => {
      const { streamId } = point
      const list: Point[] = acc.get(streamId) ?? []
      list.push(point)
      acc.set(streamId, list)
      return acc
    },
    new Map(),
  )

  // Calculate max length of value for each stream
  const maxLengthByStreamId = [...pointsByStreamId.entries()].reduce<
    Map<string, number>
  >((acc, [streamId, list]) => {
    const stream = streamList.find((stream) => stream.id === streamId)
    if (!stream) {
      throw new Error(`stream not found for id ${streamId}`)
    }

    const maxLength = list.reduce((acc, point) => {
      const { value } = point
      return Math.max(acc, firstLine(stripComments(value)).length)
    }, stream.name.length)
    acc.set(streamId, maxLength)
    return acc
  }, new Map())

  return (
    <>
      <Box columnGap={1}>
        <Box flexBasis={7} flexShrink={0}>
          <Text color="magentaBright">id</Text>
        </Box>
        <Box flexBasis={5} flexShrink={0}>
          <Text color="magentaBright">time</Text>
        </Box>
        {streamList.map((stream, index) => {
          const basis = maxLengthByStreamId.get(stream.id) ?? 0
          return (
            <Box key={index} flexBasis={basis}>
              <Text color="magentaBright">{stream.name}</Text>
            </Box>
          )
        })}
      </Box>
      {sliceList.map((slice, index) => {
        const { lineList, startedAt } = slice

        return (
          <Box key={index} columnGap={1}>
            <Box flexBasis={7} flexShrink={0}>
              <Text color="white">{lineList[0]?.id.slice(0, 7)}</Text>
            </Box>

            <Box flexBasis={5} flexShrink={0}>
              <Text color="green">{format(startedAt, 'HH:mm')}</Text>
            </Box>

            {streamList.map((stream, index) => {
              const basis = maxLengthByStreamId.get(stream.id) ?? 0

              const line = lineList.find((line) => line.streamId === stream.id)
              if (!line) {
                return <Box key={index} flexBasis={basis} />
              }

              const duration = format(new Date(line.durationMs), "H'h' mm'm'")

              return (
                <Box key={index} flexBasis={basis}>
                  <Text>
                    {firstLine(stripComments(line.value))}
                    <Newline />
                    <Text color="blueBright">+{duration}</Text>
                  </Text>
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

  const sliceListByDay = sliceList.reduce<Map<string, Slice[]>>(
    (acc, slice) => {
      // Format as Friday 02 June 2023
      const day = format(slice.startedAt, 'EEEE dd MMMM yyyy')
      const list: Slice[] = acc.get(day) ?? []
      list.push(slice)
      acc.set(day, list)
      return acc
    },
    new Map(),
  )

  return (
    <>
      {Array.from(sliceListByDay.entries()).map(([day, sliceList], index) => {
        return (
          <Box key={index} flexDirection="column" marginBottom={1}>
            <Text color="#888">{day}</Text>
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

type HandlerOptions = {
  db: KyselyDb
  currentTime: Date
  filter: {
    streamId: string | undefined
  }
}

const handler = async (options: HandlerOptions) => {
  const { db, currentTime, filter } = options

  const pointList = await retrievePointList({
    db,
    since: startOfDay(currentTime),
    filter,
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

  const streamList = await db
    .selectFrom('Stream')
    .select(['id', 'name'])
    .execute()

  render(
    <Box flexDirection="column" margin={1}>
      <MultiDaySliceList
        streamList={streamList}
        pointList={pointList}
        sliceList={sliceList}
      />
    </Box>,
  )

  return undefined
}

const logCmd = new CliCommand('log')
  .withDescription('Show a log of all points')
  .withOptions(
    {
      name: ['-s', '--stream'],
      description: 'Filter points by a Stream ',
      args: [
        { name: 'name', description: 'Name of the stream', required: true },
      ],
    },
    {
      name: ['-f', '--from'],
      description: 'Show points from a certain time',
      args: [
        {
          name: 'datetime',
          description: 'Date/time to show points from',
          required: true,
        },
      ],
    },
  )
  .withHandler(async (_args, options, _extra) => {
    const db = getDb()

    const currentTime = options['from']
      ? chrono.parseDate(options['from'])
      : new Date()

    if (currentTime instanceof Error) {
      throw currentTime
    }

    const filterStreamId = options['stream']
      ? await getStreamIdByName({ db, name: options['stream'] })
      : undefined

    if (filterStreamId instanceof Error) {
      throw new TypeError(
        `Could not find stream with name: ${options['stream']}`,
        {
          cause: filterStreamId,
        },
      )
    }

    return handler({
      db,
      filter: { streamId: filterStreamId },
      currentTime,
    })
  })

export { logCmd }
