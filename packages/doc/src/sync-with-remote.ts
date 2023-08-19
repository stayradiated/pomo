import { applyUpdate } from './apply-update.js'
import { encodeStateAsUpdate } from './encode-state-as-update.js'
import { encodeStateVectorFromUpdate } from './encode-state-vector-from-update.js'
import { diffUpdate } from './diff-update.js'
import { mergeUpdates } from './merge-updates.js'
import type { Doc } from './types.js'

type PostDiffRequest = {
  localStateVector?: Uint8Array
  localDiff?: Uint8Array
}
type PostDiffResult = {
  remoteStateVector?: Uint8Array
  remoteDiff?: Uint8Array
}

type PostDiffFn = (formData: PostDiffRequest) => Promise<PostDiffResult>

type SyncWithRemoteOptions = {
  doc: Doc
  postDiff: PostDiffFn
}

const syncWithRemote = async (
  options: SyncWithRemoteOptions,
): Promise<void | Error> => {
  const { doc, postDiff } = options

  let localState = encodeStateAsUpdate(doc)
  const localStateVector = encodeStateVectorFromUpdate(localState)

  console.log(
    `Sending state vector to the server: ${localStateVector.length} bytes`,
  )
  const { remoteDiff, remoteStateVector } = await postDiff({
    localStateVector,
  })
  if (!remoteDiff) {
    throw new Error('Expected remoteDiff, but got none')
  }

  console.log(`Received diff from server: ${remoteDiff.length} bytes`)

  applyUpdate(doc, remoteDiff)
  localState = mergeUpdates([localState, remoteDiff])

  if (remoteStateVector) {
    console.log(
      `Received state vector from server: ${remoteStateVector.length} bytes`,
    )
    const localDiff = diffUpdate(localState, remoteStateVector)
    console.log(`Sending diff to the server: ${localDiff.length} bytes`)
    await postDiff({ localDiff })
  }

  console.log('Sync complete')
}

export { syncWithRemote }
