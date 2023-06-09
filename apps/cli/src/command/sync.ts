import { CliCommand } from 'cilly'
import {
  loadDoc,
  encodeStateAsUpdate,
  encodeStateVectorFromUpdate,
  diffUpdate,
  mergeUpdates,
} from '@stayradiated/pomo-doc'
import { fetch, FormData } from 'undici'
import { getDoc, replaceDoc, saveDoc } from '#src/lib/doc.js'

type postDiffOptions = {
  remoteUrl: string
  localStateVector?: Uint8Array
  localDiff?: Uint8Array
}

type PostDiffResult = {
  remoteStateVector?: Uint8Array
  remoteDiff?: Uint8Array
}

const postDiff = async (options: postDiffOptions): Promise<PostDiffResult> => {
  const { remoteUrl, localStateVector, localDiff } = options

  const formData = new FormData()

  if (localDiff) {
    formData.append('diff', new Blob([localDiff]))
  }

  if (localStateVector) {
    formData.append('stateVector', new Blob([localStateVector]))
  }

  const response = await fetch(`${remoteUrl}/sync`, {
    method: 'POST',
    body: formData,
    headers: {
      origin: remoteUrl,
    },
  })

  const body = await response.formData()

  const output = {} as PostDiffResult

  const remoteDiffFile = body.get('diff')
  if (remoteDiffFile) {
    if (!(remoteDiffFile instanceof File)) {
      throw new TypeError('Expected diff to be a File')
    }

    const remoteDiff = new Uint8Array(await remoteDiffFile.arrayBuffer())
    output.remoteDiff = remoteDiff
  }

  const remoteStateVectorFile = body.get('stateVector')
  if (remoteStateVectorFile) {
    if (!(remoteStateVectorFile instanceof File)) {
      throw new TypeError('Expected stateVector to be a File')
    }

    const remoteStateVector = new Uint8Array(
      await remoteStateVectorFile.arrayBuffer(),
    )
    output.remoteStateVector = remoteStateVector
  }

  return output
}

type HandlerOptions = {
  remoteUrl: string
}

const handler = async (options: HandlerOptions): Promise<void | Error> => {
  const { remoteUrl } = options

  const doc = await getDoc()
  if (doc instanceof Error) {
    return doc
  }

  let localState = encodeStateAsUpdate(doc)
  const localStateVector = encodeStateVectorFromUpdate(localState)

  console.log(
    `Sending state vector to the server: ${localStateVector.length} bytes`,
  )
  const { remoteDiff, remoteStateVector } = await postDiff({
    remoteUrl,
    localStateVector,
  })
  if (!remoteDiff) {
    throw new Error('Expected remoteDiff, but got none')
  }

  console.log(`Received diff from server: ${remoteDiff.length} bytes`)

  localState = mergeUpdates([localState, remoteDiff])
  const nextDoc = loadDoc(localState)
  replaceDoc(nextDoc)
  await saveDoc()

  if (remoteStateVector) {
    console.log(
      `Received state vector from server: ${remoteStateVector.length} bytes`,
    )
    const localDiff = diffUpdate(localState, remoteStateVector)
    console.log(`Sending diff to the server: ${localDiff.length} bytes`)
    const response = await postDiff({ remoteUrl, localDiff })
    console.log(Object.keys(response))
  }
}

const syncCmd = new CliCommand('sync')
  .withDescription('Sync with a remote server')
  .withArguments({
    name: 'url',
    description: 'The URL of the remote server',
    required: true,
  })
  .withHandler(async (args) => {
    const { url: remoteUrl } = args
    const result = await handler({ remoteUrl })
    if (result instanceof Error) {
      throw result
    }
  })

export { syncCmd }
