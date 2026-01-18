import * as Y from 'yjs'

const mergeUpdates = (updateList: Uint8Array[]): Uint8Array => {
  const mergedUpdate = Y.mergeUpdatesV2(updateList)
  return mergedUpdate
}

export { mergeUpdates }
