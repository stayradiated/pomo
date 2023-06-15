import { parseISO } from 'date-fns'
import type { Line, Point } from './types.js'

const mapPointsToLine = <T extends Point>(
  startPoint: T,
  stopPoint: T | undefined,
): Line | Error => {
  if (stopPoint && startPoint.streamId !== stopPoint.streamId) {
    return new Error('Stream IDs must match')
  }

  const startedAt = parseISO(startPoint.startedAt)
  const stoppedAt = stopPoint ? parseISO(stopPoint.startedAt) : undefined
  const durationMs = stoppedAt
    ? stoppedAt.getTime() - startedAt.getTime()
    : Date.now() - startedAt.getTime()

  const line: Line = {
    id: startPoint.id,
    streamId: startPoint.streamId,
    value: startPoint.value,
    startedAt,
    stoppedAt,
    durationMs,
  }

  return line
}

export { mapPointsToLine }