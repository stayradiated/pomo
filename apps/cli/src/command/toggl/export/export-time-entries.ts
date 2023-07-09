import type { Doc } from '@stayradiated/pomo-doc'
import {
  getLabelRecord,
  getStreamByName,
  getUserTimeZone,
  retrievePointList,
} from '@stayradiated/pomo-doc'
import {
  mapPointListToLineList,
  clampLineList,
  formatDurationHMS,
} from '@stayradiated/pomo-core'
import * as dateFns from 'date-fns'
import * as dateFnsTz from 'date-fns-tz'
import type { TimeEntry } from './types.js'

type ExportTimeEntriesOptions = {
  doc: Doc
}

const exportTimeEntries = (
  options: ExportTimeEntriesOptions,
): TimeEntry[] | Error => {
  const { doc } = options

  const timeZone = getUserTimeZone({ doc })

  const labelRecord = getLabelRecord({ doc })

  const startDate = dateFns
    .startOfDay(dateFnsTz.toDate('2023-06-01', { timeZone }))
    .getTime()
  const endDate = dateFns
    .endOfDay(dateFnsTz.toDate('2023-06-30', { timeZone }))
    .getTime()

  const locationStream = getStreamByName({ doc, name: 'location' })
  if (locationStream instanceof Error) {
    return locationStream
  }

  const locationStreamId = locationStream.id

  const projectStream = getStreamByName({ doc, name: 'project' })
  if (projectStream instanceof Error) {
    return projectStream
  }

  const projectStreamId = projectStream.id

  const taskStream = getStreamByName({ doc, name: 'task' })
  if (taskStream instanceof Error) {
    return taskStream
  }

  const taskStreamId = taskStream.id

  const pointList = retrievePointList({
    doc,
    startDate,
    endDate,
    where: {
      streamIdList: [locationStreamId, projectStreamId, taskStreamId],
    },
  })

  const extendedLineList = mapPointListToLineList(pointList)
  if (extendedLineList instanceof Error) {
    return extendedLineList
  }

  const lineList = clampLineList({
    lineList: extendedLineList,
    currentTime: Date.now(),
    startDate,
    endDate,
  })

  lineList.sort((a, b) => {
    const diff = a.startedAt - b.startedAt
    if (diff !== 0) {
      return diff
    }

    const order = [locationStreamId, projectStreamId, taskStreamId]
    return order.indexOf(a.streamId) - order.indexOf(b.streamId)
  })

  const timeEntryList: TimeEntry[] = []

  let currentLocationLine = lineList.find((line) => {
    return line.streamId === locationStreamId
  })!
  let currentProjectLine = lineList.find((line) => {
    return line.streamId === projectStreamId
  })!

  for (const line of lineList) {
    switch (line.streamId) {
      case locationStreamId: {
        currentLocationLine = line
        break
      }

      case projectStreamId: {
        currentProjectLine = line
        break
      }
    }

    const isTask = line.streamId === taskStreamId
    if (!isTask) {
      continue
    }

    const startedAt = dateFnsTz.utcToZonedTime(line.startedAt, timeZone)
    const startTime = dateFnsTz.format(startedAt, 'HH:mm:ss')
    const startDate = dateFnsTz.format(startedAt, 'yyyy-MM-dd')
    const duration = formatDurationHMS(line.durationMs)

    const projectLabelId = currentProjectLine.labelIdList[0]
    const projectLabel = projectLabelId
      ? labelRecord[projectLabelId]
      : undefined
    const project = projectLabel ? projectLabel.name : 'Life'

    const tags = [...line.labelIdList, ...currentLocationLine.labelIdList]
      .map((labelId) => {
        return labelRecord[labelId]?.name
      })
      .filter(Boolean)
      .join(', ')

    const description = line.labelIdList
      .map((labelId) => {
        return labelRecord[labelId]?.name
      })
      .filter(Boolean)
      .sort()
      .join(', ')

    const timeEntry: TimeEntry = {
      email: 'mahjongbottle@stayradiated.com',
      duration,
      startTime,
      startDate,
      description,
      project,
      task: '',
      client: '',
      tags,
      billable: 'No',
    }

    timeEntryList.push(timeEntry)
  }

  return timeEntryList
}

export { exportTimeEntries }
