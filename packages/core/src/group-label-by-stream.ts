import type { Label } from '@stayradiated/pomo-doc'

type StreamLabelRecord = Record<string, Record<string, Label>>

const groupLabelByStream = (
  labelRecord: Record<string, Label>,
): StreamLabelRecord => {
  const byStream: StreamLabelRecord = {}
  for (const label of Object.values(labelRecord)) {
    const { streamId } = label
    let streamGroup = byStream[streamId]
    if (!streamGroup) {
      streamGroup = {}
      byStream[streamId] = streamGroup
    }

    streamGroup[label.id] = label
  }

  return byStream
}

export { groupLabelByStream }
