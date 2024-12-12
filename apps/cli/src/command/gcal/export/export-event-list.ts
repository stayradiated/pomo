import {
  clampLineList,
  mapPointListToLineList,
  stripComments,
} from '@stayradiated/pomo-core'
import type { Doc } from '@stayradiated/pomo-doc'
import {
  getLabelRecord,
  getStreamByName,
  getUserTimeZone,
  retrievePointList,
} from '@stayradiated/pomo-doc'
import * as dateFns from 'date-fns'
import * as dateFnsTz from 'date-fns-tz'
import type { Event } from './types.js'

type ExportEventListOptions = {
  doc: Doc
  startDateString: `${number}-${number}-${number}`
  endDateString: `${number}-${number}-${number}`
}

const exportEventList = (options: ExportEventListOptions): Event[] | Error => {
  const { doc, startDateString, endDateString } = options

  const timeZone = getUserTimeZone({ doc })

  const labelRecord = getLabelRecord({ doc })

  const startDate = dateFns
    .startOfDay(dateFnsTz.toDate(startDateString, { timeZone }))
    .getTime()
  const endDate = dateFns
    .endOfDay(dateFnsTz.toDate(endDateString, { timeZone }))
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

  const eventList: Event[] = []

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

    const startedAt = dateFnsTz.toZonedTime(line.startedAt, timeZone)
    const startTime = dateFnsTz.format(startedAt, 'HH:mm a')
    const startDate = dateFnsTz.format(startedAt, 'MM/dd/yyyy')

    const stoppedAt = dateFnsTz.toZonedTime(line.stoppedAt!, timeZone)
    const endTime = dateFnsTz.format(stoppedAt, 'HH:mm a')
    const endDate = dateFnsTz.format(stoppedAt, 'MM/dd/yyyy')

    const projectLabelId = currentProjectLine.labelIdList[0]
    const projectLabel = projectLabelId
      ? labelRecord[projectLabelId]
      : undefined
    const projectName = projectLabel ? projectLabel.name : 'Life'

    const taskLabelNames = line.labelIdList
      .map((labelId) => {
        return labelRecord[labelId]?.name
      })
      .filter(Boolean)
      .sort()
      .join(', ')

    const subject = `${projectName}: ${taskLabelNames}`

    const description = stripComments(line.value)

    const location = currentLocationLine.labelIdList
      .map((labelId) => {
        return labelRecord[labelId]?.name
      })
      .filter(Boolean)
      .sort()
      .join(', ')

    const event: Event = {
      subject,
      startTime,
      startDate,
      endTime,
      endDate,
      allDayEvent: 'False',
      description,
      location,
      private: 'False',
    }

    eventList.push(event)
  }

  return eventList
}

export { exportEventList }
