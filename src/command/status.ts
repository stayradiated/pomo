import { intervalToDuration, formatDuration } from 'date-fns'
import type { KyselyDb } from '#src/core/db.js'
import { retrievePointList } from '#src/core/retrieve-point-list.js'
import { getStreamNameById } from '#src/core/get-stream-name-by-id.js'
import { mapPointListToLineList } from '#src/core/map-point-list-to-line-list.js'
import { stripComments } from '#src/core/text.js'

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
