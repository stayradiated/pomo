import type { Point } from '@stayradiated/pomo-core'
import type { AutomergeDoc } from './types.js'

type RetrieveCurrentPointOptions = {
  doc: AutomergeDoc
  streamId: string
  currentTime: number
}

const retrieveCurrentPoint = (
  options: RetrieveCurrentPointOptions,
): Point | undefined => {
  const { doc, streamId, currentTime } = options

  const currentPoint = Object.values(doc.point)
    .filter((point) => {
      return point.streamId === streamId && point.startedAt <= currentTime
    })
    .sort((a, b) => {
      return b.startedAt - a.startedAt
    })[0]

  return currentPoint
}

export { retrieveCurrentPoint }
