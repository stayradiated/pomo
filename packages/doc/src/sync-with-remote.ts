import { applyUpdate } from './apply-update.js'
import { encodeStateAsUpdate } from './encode-state-as-update.js'
import { encodeStateVectorFromUpdate } from './encode-state-vector-from-update.js'
import { diffUpdate } from './diff-update.js'
import { mergeUpdates } from './merge-updates.js'
import type { Doc } from './types.js'

type SyncTransportData = {
  stateVector?: Uint8Array | undefined
  diff?: Uint8Array | undefined
}

type SyncWithRemoteOptions = {
  doc: Doc
  remote?: SyncTransportData
  shouldSendDiff?: boolean
  shouldSendStateVector?: boolean
  shouldApplyDiff?: boolean
}

const syncWithRemote = (options: SyncWithRemoteOptions): SyncTransportData => {
  const {
    doc,
    remote,
    shouldApplyDiff,
    shouldSendStateVector,
    shouldSendDiff,
  } = options

  let localState = encodeStateAsUpdate(doc)
  const local: SyncTransportData = {}

  if (shouldApplyDiff) {
    if (!remote?.diff) {
      throw new Error('Cannot apply diff without remote diff')
    }

    console.log(`Received diff: ${remote.diff.length} bytes`)
    localState = mergeUpdates([localState, remote.diff])
    applyUpdate(doc, remote.diff)
  }

  if (shouldSendStateVector) {
    local.stateVector = encodeStateVectorFromUpdate(localState)
    console.log(`Sending state vector: ${local.stateVector.length} bytes`)
  }

  if (shouldSendDiff) {
    if (!remote?.stateVector) {
      throw new Error('Cannot send diff without remote state vector')
    }

    const localDiff = diffUpdate(localState, remote.stateVector)
    local.diff = localDiff
    console.log(`Sending diff: ${local.diff.length} bytes`)
  }

  return local
}

export { syncWithRemote }
export type { SyncTransportData }
