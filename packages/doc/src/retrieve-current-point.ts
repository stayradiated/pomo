import { filter } from '@vangware/iterables'
import type { Doc, YPoint, Point } from './types.js'

type RetrieveCurrentPointOptions = {
  doc: Doc
  streamId: string
  currentTime: number
}

const retrieveCurrentPoint = (
  options: RetrieveCurrentPointOptions,
): Point | undefined => {
  const { doc, streamId, currentTime } = options

  const pointMap = doc.getMap('point')

  const filterCurrent = filter((point: YPoint) => {
    return (
      point.get('streamId') === streamId &&
      point.get('startedAt')! <= currentTime
    )
  })

  const currentPoint = [...filterCurrent(pointMap.values())]
    .sort((a, b) => {
      return b.get('startedAt')! - a.get('startedAt')!
    })[0]
    ?.toJSON() as Point | undefined

  return currentPoint
}

export { retrieveCurrentPoint }
