import type { Point, Stream } from "@stayradiated/pomo-core";
import type { AutomergeDoc } from "@stayradiated/pomo-doc"
import { retrieveCurrentPoint } from "@stayradiated/pomo-doc"

type GetCurrentPointsOptions = {
  doc: AutomergeDoc,
  streamList: Stream[],
  currentTime: number,
}

const getCurrentPoints = (options: GetCurrentPointsOptions): Map<string, Point> => {
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
