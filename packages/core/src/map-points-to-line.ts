import type { Line, Point } from './types.js'

const mapPointsToLine = <T extends Point>(
  startPoint: T,
  stopPoint: T | undefined,
): Line | Error => {
  if (stopPoint && startPoint.streamId !== stopPoint.streamId) {
    return new Error('Stream IDs must match')
  }

  const startedAt = startPoint.startedAt
  const stoppedAt = stopPoint ? stopPoint.startedAt : undefined

  // TODO: is using Date.now() to calculate duration timezone safe?
  const durationMs = stoppedAt ? stoppedAt - startedAt : Date.now() - startedAt

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
