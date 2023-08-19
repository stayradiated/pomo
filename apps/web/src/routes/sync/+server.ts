import type { RequestEvent } from './$types'
import { getDoc, replaceDoc, saveDoc } from '$lib/doc.js'
import {
  loadDoc,
  encodeStateAsUpdate,
  encodeStateVectorFromUpdate,
  diffUpdate,
  mergeUpdates,
} from '@stayradiated/pomo-doc'

const POST = async ({ request }: RequestEvent) => {
  // TODO: use an API key or something
  
  const requestFormData = await request.formData()
  const responseFormData = new FormData()

  let localState: Uint8Array

  {
    const doc = await getDoc()
    if (doc instanceof Error) {
      return new Response(doc.message, { status: 500 })
    }
    localState = encodeStateAsUpdate(doc)
  }

  const remoteDiffFile = requestFormData.get('diff')
  if (remoteDiffFile) {
    if (!(remoteDiffFile instanceof File)) {
      throw new Error('Expected diff to be a File')
    }
    const remoteDiff = new Uint8Array(await remoteDiffFile.arrayBuffer())
    console.log(`Received diff from client: ${remoteDiff.length} bytes`)

    localState = mergeUpdates([localState, remoteDiff])
    replaceDoc(loadDoc(localState))
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

  const response = new Response(responseFormData, { status: 200 })
  response.headers.append('Access-Control-Allow-Origin', '*')
  return response
}

export { POST }
