import {
  mapLineListToVerboseSliceList,
  mapPointListToLineList,
} from '@stayradiated/pomo-core'
import {
  getLabelByName,
  getStreamByName,
  getUserTimeZone,
  retrievePointList,
} from '@stayradiated/pomo-doc'
import type { Doc } from '@stayradiated/pomo-doc'
import * as chrono from 'chrono-node'
import { CliCommand } from 'cilly'
import * as dateFns from 'date-fns'
import * as dateFnsTz from 'date-fns-tz'
import { getDoc } from '#src/lib/doc.js'

type StreamLabelPair = {
  streamName: string
  labelName: string
}

// Parse the where input into a list of stream/label pairs
const parseWhere = (whereString?: string): StreamLabelPair[] => {
  if (!whereString) {
    return []
  }

  return whereString.split(',').map((pair) => {
    const [streamName, labelName] = pair.split('=')
    if (!streamName || !labelName) {
      throw new Error(`Invalid pair: ${pair}. Expected format: stream=label`)
    }
    return {
      streamName,
      labelName,
    }
  })
}

type HandlerOptions = {
  doc: Doc
  where: StreamLabelPair[]
  timeZone: string
  startDate: number // Epoch timestamp
  endDate: number // Epoch timestamp
}

const handler = (options: HandlerOptions): undefined | Error => {
  const { doc, where, timeZone, startDate, endDate } = options

  // Convert stream/label pairs to stream/label IDs
  const streamLabelPairs = where.map((pair) => {
    const stream = getStreamByName({ doc, name: pair.streamName })
    if (stream instanceof Error) {
      throw stream
    }

    const label = getLabelByName({
      doc,
      streamId: stream.id,
      name: pair.labelName,
    })
    if (label instanceof Error) {
      throw label
    }

    return {
      streamId: stream.id,
      labelId: label.id,
      streamName: pair.streamName, // Keep original names for logging
      labelName: pair.labelName,
    }
  })

  // Get unique stream IDs to query
  const uniqueStreamIds = Array.from(
    new Set(streamLabelPairs.map((item) => item.streamId)),
  )

  // Retrieve all points for the relevant streams within the date range
  const pointList = retrievePointList({
    doc,
    startDate,
    endDate,
    where: {
      streamIdList: uniqueStreamIds,
    },
  })

  // Convert points to lines
  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  // Convert lines to time slices
  const sliceList = mapLineListToVerboseSliceList(lineList)

  // Find slices where all specified stream/label pairs are active
  const matchingSlices = sliceList
    .filter((slice) => {
      // For each stream/label pair requirement
      return streamLabelPairs.every((criteria) => {
        // Find a line in this slice that matches the stream
        const matchingLine = slice.lineList.find(
          (line) => line.streamId === criteria.streamId,
        )

        // If no matching line, this slice doesn't satisfy the criteria
        if (!matchingLine) return false

        // Check if the line has the required label
        return matchingLine.labelIdList.includes(criteria.labelId)
      })
    })
    // Sort in reverse chronological order
    .sort((a, b) => b.startedAt - a.startedAt)

  // Print results in a table format
  if (matchingSlices.length === 0) {
    console.log('No matching entries found.')
    return
  }

  console.log(
    `Found ${matchingSlices.length} time periods where all criteria were met simultaneously:`,
  )
  console.log()
  console.log('|---|----------|------------------|-------|')
  console.log('| # | Day      | Date             | Start |')
  console.log('|---|----------|------------------|-------|')

  matchingSlices.forEach((slice, index) => {
    const startDateTime = dateFnsTz.toZonedTime(slice.startedAt, timeZone)

    const dayName = dateFns.format(startDateTime, 'EEEE')
    const dateString = dateFns.format(startDateTime, 'd MMMM yyyy')
    const startTimeString = dateFns.format(startDateTime, 'HH:mm')

    console.log(
      `| ${(index + 1).toString().padEnd(1)} | ${dayName.padEnd(8)} | ${dateString.padEnd(16)} | ${startTimeString} |`,
    )
  })
  console.log('|---|----------|------------------|-------|')
  console.log()

  // Show first matching slice details
  if (matchingSlices.length > 0) {
    const firstSlice = matchingSlices[0]
    console.log('Latest match details:')
    console.log('---')

    streamLabelPairs.forEach((pair) => {
      const matchingLine = firstSlice.lineList.find(
        (line) => line.streamId === pair.streamId,
      )

      if (matchingLine) {
        console.log(`${pair.streamName}=${pair.labelName}:`)
        console.log(`  Value: ${matchingLine.value}`)
      }
    })
    console.log('---')
  }
}

const whenCmd = new CliCommand('when')
  .withDescription('Find out when a specific activity happened')
  .withOptions(
    {
      name: ['-w', '--where'],
      description: 'Filter by a list of stream=label pairs',
      args: [
        {
          name: 'pairs',
          description: 'Comma-separated list of stream=label pairs',
          required: true,
        },
      ],
    },
    {
      name: ['-f', '--start-date'],
      description: 'Start date for the time range',
      defaultValue: '2000-01-01',
      args: [
        {
          name: 'date',
          description: 'Date in any reasonable format',
          required: true,
        },
      ],
    },
    {
      name: ['-t', '--end-date'],
      description: 'End date for the time range',
      defaultValue: 'now',
      args: [
        {
          name: 'date',
          description: 'Date in any reasonable format',
          required: true,
        },
      ],
    },
  )
  .withHandler(async (_args, options) => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const timeZone = getUserTimeZone({ doc })
    const where = parseWhere(options.where)

    if (where.length === 0) {
      throw new Error(
        "No filtering criteria provided. Use --where 'stream=label[,stream=label,...]'",
      )
    }

    // Parse start date using chrono
    const startDateStr = options.startDate || '2000-01-01'
    const startDate = chrono.parseDate(startDateStr, {
      timezone: timeZone,
    })
    if (!startDate) {
      throw new Error(`Could not parse start date: ${startDateStr}`)
    }

    // Parse end date using chrono
    const endDateStr = options.endDate || 'now'
    const endDate = chrono.parseDate(endDateStr, {
      timezone: timeZone,
      instant: new Date(),
    })
    if (!endDate) {
      throw new Error(`Could not parse end date: ${endDateStr}`)
    }

    // Ensure start is before end
    if (startDate > endDate) {
      throw new Error('Start date must be before end date')
    }

    const result = handler({
      doc,
      where,
      timeZone,
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
    })

    if (result instanceof Error) {
      throw result
    }
  })

export { whenCmd }
