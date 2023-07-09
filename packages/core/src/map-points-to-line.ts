import type { Point } from '@stayradiated/pomo-doc'
import type { Line } from './types.js'

const mapPointsToLine = <T extends Point>(
  startPoint: T,
  stopPoint: T | undefined,
): Line | Error => {
  if (stopPoint && startPoint.streamId !== stopPoint.streamId) {
    return new Error('Stream IDs must match')
  }

  const startedAt = startPoint.startedAt
  const stoppedAt = stopPoint ? stopPoint.startedAt : null

  const durationMs = stoppedAt ? stoppedAt - startedAt : Date.now() - startedAt

  const line: Line = {
    id: startPoint.id,
    streamId: startPoint.streamId,
    value: startPoint.value,
    labelIdList: startPoint.labelIdList,
    startedAt,
    stoppedAt,
    durationMs,
  }

  return line
}

export { mapPointsToLine }
