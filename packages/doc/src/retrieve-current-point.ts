import type { Doc, Point } from './types.js'

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

  const currentPoint = [...pointMap.values()]
    .filter((point) => {
      return (
        point.get('streamId') === streamId &&
        point.get('startedAt')! <= currentTime
      )
    })

    .sort((a, b) => {
      return b.get('startedAt')! - a.get('startedAt')!
    })[0]
    ?.toJSON() as Point | undefined

  return currentPoint
}

export { retrieveCurrentPoint }
