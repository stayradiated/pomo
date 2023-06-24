import type { Line } from './types.js'

const clampLineList = (options: {
  lineList: Line[]
  startDate: number
  endDate: number
}): Line[] => {
  const { lineList, startDate, endDate } = options

  return lineList
    .filter((line) => {
      return (
        line.startedAt < endDate &&
        (line.stoppedAt ?? Number.POSITIVE_INFINITY) > startDate
      )
    })
    .map((line) => {
      const startedAtClamped = Math.max(line.startedAt, startDate)
      const stoppedAtClamped = Math.min(
        line.stoppedAt ?? Number.POSITIVE_INFINITY,
        endDate,
      )

      const durationMs = stoppedAtClamped - startedAtClamped

      return {
        ...line,
        startedAt: startedAtClamped,
        stoppedAt: stoppedAtClamped,
        durationMs,
      }
    })
}

export { clampLineList }
