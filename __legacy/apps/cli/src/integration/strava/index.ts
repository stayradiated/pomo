import { listOrError } from '@stayradiated/error-boundary'
import {
  NotFoundError,
  getPointByStartedAt,
  transact,
  upsertLabel,
  upsertPoint,
  upsertStream,
} from '@stayradiated/pomo-doc'
import type { Doc } from '@stayradiated/pomo-doc'
import * as dateFns from 'date-fns'
import { getOrRefreshSession } from './auth.js'
import { getAllActivities } from './get-all-activities.js'
import type { Session } from './types.js'

const MAX_MATCHED_ACTIVITIES = 10

type Options = {
  doc: Doc
  clientId: string
  clientSecret: string
  serverPort?: number
  initialSession?: Session
  forceFetchAll?: boolean
}

type Result = {
  session: Session
}

const pullStravaActivities = async (
  options: Options,
): Promise<Result | Error> => {
  const {
    doc,
    initialSession,
    clientId,
    clientSecret,
    serverPort = 30_868,
    forceFetchAll = false,
  } = options

  const session = await getOrRefreshSession({
    clientId,
    clientSecret,
    serverPort,
    session: initialSession,
  })

  const streamId = transact(doc, () => upsertStream({ doc, name: 'strava' }))
  if (streamId instanceof Error) {
    return new Error('Could not create stream')
  }

  let matchedActivities = 0

  for await (const activity of getAllActivities(session.accessToken)) {
    const startDate = new Date(activity.start_date)
    const stopDate = new Date(
      startDate.getTime() + activity.elapsed_time * 1000,
    )

    const existingPoint = getPointByStartedAt({
      doc,
      streamId,
      startedAt: startDate.getTime(),
    })
    if (existingPoint instanceof NotFoundError) {
      matchedActivities = 0
    } else if (existingPoint instanceof Error) {
      return existingPoint
    } else {
      matchedActivities += 1
    }

    if (!forceFetchAll && matchedActivities >= MAX_MATCHED_ACTIVITIES) {
      console.log(`Reached ${matchedActivities} matched activities, stopping`)
      break
    }

    // Round distance to 100m
    const distanceKm = Math.round(activity.distance / 100) / 10

    const durationMin = Math.round(activity.elapsed_time / 60)

    console.log(
      dateFns.format(startDate, 'yyyy-MM-dd HH:mm:ss'),
      `| ${durationMin} min`,
      `| ${activity.name}`,
      `| ${activity.type}`,
      `| ${distanceKm} km`,
    )

    const labelType = transact(doc, () =>
      upsertLabel({
        doc,
        streamId,
        name: activity.type,
      }),
    )
    if (labelType instanceof Error) {
      return labelType
    }

    const labelDistance = transact(doc, () =>
      upsertLabel({
        doc,
        streamId,
        name: `${distanceKm} km`,
      }),
    )
    if (labelDistance instanceof Error) {
      return labelDistance
    }

    const result = transact(doc, () =>
      listOrError([
        upsertPoint({
          doc,
          streamId,
          startedAt: startDate.getTime(),
          value: activity.name,
          labelIdList: [labelType, labelDistance],
        }),
        upsertPoint({
          doc,
          streamId,
          value: '',
          startedAt: stopDate.getTime(),
        }),
      ]),
    )
    if (result instanceof Error) {
      return result
    }
  }

  return { session }
}

export { pullStravaActivities }

export type { Session } from './types.js'
