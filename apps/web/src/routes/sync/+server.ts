import type { RequestEvent } from './$types'
import { getDoc, saveDoc } from '$lib/doc.js'
import {
  applyUpdate,
  encodeStateAsUpdate,
  encodeStateVectorFromUpdate,
  diffUpdate,
  mergeUpdates,
} from '@stayradiated/pomo-doc'

const POST = async ({ request }: RequestEvent) => {
  // TODO: use an API key or something
  
  const requestFormData = await request.formData()
  const responseFormData = new FormData()

  const doc = await getDoc()
  if (doc instanceof Error) {
    return new Response(doc.message, { status: 500 })
  }
  let localState = encodeStateAsUpdate(doc)

  const remoteDiffFile = requestFormData.get('diff')
  if (remoteDiffFile) {
    if (!(remoteDiffFile instanceof File)) {
      throw new Error('Expected diff to be a File')
    }
    const remoteDiff = new Uint8Array(await remoteDiffFile.arrayBuffer())
    console.log(`Received diff from client: ${remoteDiff.length} bytes`)

    localState = mergeUpdates([localState, remoteDiff])
    applyUpdate(doc, remoteDiff)
    await saveDoc()
  }

  const remoteStateVectorFile = requestFormData.get('stateVector')
  if (remoteStateVectorFile) {
    if (!(remoteStateVectorFile instanceof File)) {
      throw new Error('Expected stateVector to be a File')
    }
    const remoteStateVector = new Uint8Array(
      await remoteStateVectorFile.arrayBuffer(),
    )
    console.log(
      `Received state vector from client: ${remoteStateVector.length} bytes`,
    )

    const localDiff = diffUpdate(localState, remoteStateVector)
    responseFormData.append('diff', new Blob([localDiff]))
    console.log(`Sending diff to client: ${localDiff.length} bytes`)

    const localStateVector = encodeStateVectorFromUpdate(localState)
    responseFormData.append('stateVector', new Blob([localStateVector]))
    console.log(
      `Sending state vector to client: ${localStateVector.length} bytes`,
    )
  }

  return new Response(responseFormData, { status: 200 })
}

export { POST }
