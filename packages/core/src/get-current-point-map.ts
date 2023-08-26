import type { Doc, Point } from '@stayradiated/pomo-doc'
import { retrieveCurrentPoint } from '@stayradiated/pomo-doc'

type GetCurrentPointMapOptions = {
  doc: Doc
  streamIdList: string[]
  currentTime: number
}

const getCurrentPointMap = (
  options: GetCurrentPointMapOptions,
): Map<string, Point> => {
  const { doc, streamIdList, currentTime } = options

  const output = new Map<string, Point>()

  for (const streamId of streamIdList) {
    const currentPoint = retrieveCurrentPoint({
      doc,
      streamId,
      currentTime,
    })
    if (currentPoint) {
      output.set(streamId, currentPoint)
    }
  }

  return output
}

export { getCurrentPointMap }
