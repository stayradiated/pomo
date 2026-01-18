import type { Line } from './types.js'

type ClampLineListOptions = {
  lineList: Line[]
  currentTime: number
  startDate: number
  endDate: number
}

const clampLineList = (options: ClampLineListOptions): Line[] => {
  const { lineList, currentTime, startDate, endDate } = options

  return lineList
    .filter((line) => {
      return (
        line.startedAt < endDate && (line.stoppedAt ?? currentTime) > startDate
      )
    })
    .map((line) => {
      const startedAtClamped = Math.max(line.startedAt, startDate)
      const stoppedAtClamped = Math.min(line.stoppedAt ?? currentTime, endDate)

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
