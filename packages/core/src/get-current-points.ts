import type { Doc, Point, Stream } from '@stayradiated/pomo-doc'
import { retrieveCurrentPoint } from '@stayradiated/pomo-doc'

type GetCurrentPointsOptions = {
  doc: Doc
  streamList: Stream[]
  currentTime: number
}

const getCurrentPoints = (
  options: GetCurrentPointsOptions,
): Map<string, Point> => {
  const { doc, streamList, currentTime } = options

  const output = new Map<string, Point>()

  for (const stream of streamList) {
    const currentPoint = retrieveCurrentPoint({
      doc,
      streamId: stream.id,
      currentTime,
    })
    if (currentPoint) {
      output.set(stream.id, currentPoint)
    }
  }

  return output
}

export { getCurrentPoints }
