import type { Point, Stream } from "@stayradiated/pomo-core";
import type { KyselyDb } from "@stayradiated/pomo-db"
import { retrieveCurrentPoint } from "@stayradiated/pomo-db"

type GetCurrentPointsOptions = {
  db: KyselyDb,
  streamList: Stream[],
  currentTime: Date,
}

const getCurrentPoints = async (options: GetCurrentPointsOptions): Promise<Map<string, Point>> => {
  const { db, streamList, currentTime } = options

  const output = new Map<string, Point>()

  for (const stream of streamList) {
    const currentPoint = await retrieveCurrentPoint({
      db,
      streamId: stream.id,
      currentTime,
    })
    if (currentPoint instanceof Error) {
      throw currentPoint
    }
    if (currentPoint) {
      output.set(stream.id, currentPoint)
    }
  }

  return output
}

export { getCurrentPoints }
