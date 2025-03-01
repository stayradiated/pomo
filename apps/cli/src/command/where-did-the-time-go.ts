import {
  clampLineList,
  durationLocale,
  mapPointListToLineList,
  startOfDayWithTimeZone,
} from '@stayradiated/pomo-core'
import type { Line } from '@stayradiated/pomo-core'
import {
  getLabelById,
  getLabelByName,
  getStreamByName,
  getUserTimeZone,
  retrievePointList,
} from '@stayradiated/pomo-doc'
import type { Doc } from '@stayradiated/pomo-doc'
import * as chrono from 'chrono-node'
import { CliCommand } from 'cilly'
import * as dateFns from 'date-fns'
import { getDoc } from '#src/lib/doc.js'

type HandlerOptions = {
  doc: Doc
  groupByStreamName: string
  filterByStreamName: string
  filterByLabelName: string
  startDate: number
  endDate: number
}

const handler = (options: HandlerOptions): undefined | Error => {
  const {
    doc,
    groupByStreamName,
    filterByStreamName,
    filterByLabelName,
    startDate,
    endDate,
  } = options

  // Get the streams we need
  const groupByStream = getStreamByName({ doc, name: groupByStreamName })
  if (groupByStream instanceof Error) {
    return groupByStream
  }

  const filterByStream = getStreamByName({ doc, name: filterByStreamName })
  if (filterByStream instanceof Error) {
    return filterByStream
  }

  // Get the filter label
  const filterLabel = getLabelByName({
    doc,
    streamId: filterByStream.id,
    name: filterByLabelName,
  })
  if (filterLabel instanceof Error) {
    return filterLabel
  }

  // First, we need to find the time ranges where the filter label was active
  const filterPointList = retrievePointList({
    doc,
    startDate,
    endDate,
    where: {
      streamIdList: [filterByStream.id],
    },
  })

  const filterLineList = mapPointListToLineList(filterPointList)
  if (filterLineList instanceof Error) {
    return filterLineList
  }

  // Filter to only lines with our target label
  const activeFilterLineList = filterLineList.filter((line) =>
    line.labelIdList.includes(filterLabel.id),
  )

  // Clamp the lines to our date range
  const clampedFilterLineList = clampLineList({
    lineList: activeFilterLineList,
    currentTime: Date.now(),
    startDate,
    endDate,
  })

  // Now get all the lines from the group-by stream
  const groupByPointList = retrievePointList({
    doc,
    startDate,
    endDate,
    where: {
      streamIdList: [groupByStream.id],
    },
  })

  const groupByLineList = mapPointListToLineList(groupByPointList)
  if (groupByLineList instanceof Error) {
    return groupByLineList
  }

  const clampedGroupByLineList = clampLineList({
    lineList: groupByLineList,
    currentTime: Date.now(),
    startDate,
    endDate,
  })

  // Map to store durations by label
  const labelDurationMap = new Map<string, number>()

  // For each active filter time range
  for (const filterLine of clampedFilterLineList) {
    const filterStart = filterLine.startedAt
    const filterEnd = filterLine.stoppedAt || Date.now()

    // Find all group-by lines that overlap with this filter line
    for (const groupByLine of clampedGroupByLineList) {
      const groupByStart = groupByLine.startedAt
      const groupByEnd = groupByLine.stoppedAt || Date.now()

      // Check for overlap
      if (groupByStart <= filterEnd && groupByEnd >= filterStart) {
        // Calculate the overlapping time range
        const overlapStart = Math.max(filterStart, groupByStart)
        const overlapEnd = Math.min(filterEnd, groupByEnd)
        const overlapDuration = overlapEnd - overlapStart

        if (overlapDuration <= 0) continue

        // Add duration for each label
        for (const labelId of groupByLine.labelIdList) {
          const label = getLabelById({ doc, labelId })
          if (label instanceof Error) continue

          const currentDuration = labelDurationMap.get(label.name) || 0
          labelDurationMap.set(label.name, currentDuration + overlapDuration)
        }

        // If no labels, use an empty label
        if (groupByLine.labelIdList.length === 0) {
          const currentDuration = labelDurationMap.get('(no label)') || 0
          labelDurationMap.set('(no label)', currentDuration + overlapDuration)
        }
      }
    }
  }

  // Sort labels by duration (descending)
  const sortedLabels = [...labelDurationMap.entries()].sort(
    (a, b) => b[1] - a[1],
  )

  // Display results
  for (const [labelName, durationMs] of sortedLabels) {
    const duration = dateFns.formatDuration(
      dateFns.intervalToDuration({ start: 0, end: durationMs }),
      {
        format: ['days', 'hours', 'minutes'],
        locale: durationLocale,
      },
    )

    console.log(`- ${labelName}: ${duration}`)
  }

  return undefined
}

const whereDidTheTimeGoCmd = new CliCommand('where-did-the-time-go')
  .withDescription(
    'Analyze how time was spent, grouped and filtered by streams and labels',
  )
  .withOptions(
    {
      name: ['-g', '--group-by-stream'],
      description: 'Stream to group results by',
      required: true,
      args: [
        {
          name: 'name',
          description: 'Stream name to group by',
          required: true,
        },
      ],
    },
    {
      name: ['-s', '--filter-by-stream'],
      description: 'Stream to filter results by',
      required: true,
      args: [
        {
          name: 'name',
          description: 'Stream name to filter by',
          required: true,
        },
      ],
    },
    {
      name: ['-l', '--filter-by-label'],
      description: 'Label to filter results by',
      required: true,
      args: [
        {
          name: 'name',
          description: 'Label name to filter by',
          required: true,
        },
      ],
    },
    {
      name: ['-f', '--start-date'],
      description: 'Start date (YYYY.MM.DD)',
      required: true,
      args: [{ name: 'date', description: 'Start date', required: true }],
    },
    {
      name: ['-t', '--end-date'],
      description: 'End date (YYYY.MM.DD)',
      required: true,
      args: [{ name: 'date', description: 'End date', required: true }],
    },
  )
  .withHandler(async (_args, options) => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const timeZone = getUserTimeZone({ doc })

    // Parse dates from YYYY.MM.DD format
    const startDateParts = options.startDate.split('.')
    const endDateParts = options.endDate.split('.')

    if (startDateParts.length !== 3 || endDateParts.length !== 3) {
      throw new Error('Dates should be in format YYYY.MM.DD')
    }

    const startDateStr = `${startDateParts[0]}-${startDateParts[1]}-${startDateParts[2]}`
    const endDateStr = `${endDateParts[0]}-${endDateParts[1]}-${endDateParts[2]}`

    const startDate = startOfDayWithTimeZone({
      instant: new Date(startDateStr).getTime(),
      timeZone,
    }).getTime()

    const endDate = dateFns.endOfDay(new Date(endDateStr)).getTime()

    const result = handler({
      doc,
      groupByStreamName: options.groupByStream,
      filterByStreamName: options.filterByStream,
      filterByLabelName: options.filterByLabel,
      startDate,
      endDate,
    })

    if (result instanceof Error) {
      throw result
    }
  })

export { whereDidTheTimeGoCmd }
