import * as Y from 'yjs'

const diffUpdate = (
  localState: Uint8Array,
  remoteStateVector: Uint8Array,
): Uint8Array => {
  const update = Y.diffUpdateV2(localState, remoteStateVector)
  return update
}

export { diffUpdate }
