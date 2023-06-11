import { intervalToDuration, formatDuration } from 'date-fns'
import type { KyselyDb } from '@stayradiated/pomo-db'
import { retrievePointList, getStreamNameById } from '@stayradiated/pomo-db'
import { mapPointListToLineList, stripComments } from '@stayradiated/pomo-core'

type StatusCmdOptions = {
  db: KyselyDb
  filter: { streamId?: string }
  currentTime: Date
}

const statusCmd = async (options: StatusCmdOptions): Promise<void | Error> => {
  const { db, currentTime, filter } = options

  const pointList = await retrievePointList({
    db,
    since: currentTime,
    filter,
  })
  if (pointList instanceof Error) {
    return pointList
  }

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  for (const line of lineList) {
    const streamName = await getStreamNameById({ db, id: line.streamId })
    if (streamName instanceof Error) {
      return streamName
    }

    const elapsed = intervalToDuration({
      start: line.startedAt,
      end: currentTime,
    })

    console.log(
      JSON.stringify({
        stream: streamName,
        value: stripComments(line.value),
        elapsed:
          formatDuration(elapsed, {
            format:
              elapsed.hours || elapsed.minutes
                ? ['hours', 'minutes']
                : ['seconds'],
          }) + ' ago',
      }),
    )
  }
}

export { statusCmd }
