import { CliCommand } from 'cilly'
import { syncWithRemote } from '@stayradiated/pomo-doc'
import type { SyncTransportData } from '@stayradiated/pomo-doc'
import { fetch, FormData } from 'undici'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const transport = async (
  remoteUrl: string,
  local: SyncTransportData,
): Promise<SyncTransportData> => {
  const formData = new FormData()
  if (local.diff) {
    formData.append('diff', new Blob([local.diff]))
  }

  if (local.stateVector) {
    formData.append('stateVector', new Blob([local.stateVector]))
  }

  const origin = new URL(remoteUrl).origin

  const response = await fetch(remoteUrl, {
    method: 'POST',
    body: formData,
    headers: {
      origin,
    },
  })
  const body = await response.formData()

  const remoteDiffFile = body.get('diff')
  const remoteStateVectorFile = body.get('stateVector')

  const remoteDiff =
    remoteDiffFile && remoteDiffFile instanceof File
      ? new Uint8Array(await remoteDiffFile.arrayBuffer())
      : undefined

  const remoteStateVector =
    remoteStateVectorFile && remoteStateVectorFile instanceof File
      ? new Uint8Array(await remoteStateVectorFile.arrayBuffer())
      : undefined

  return { diff: remoteDiff, stateVector: remoteStateVector }
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

  const remoteData = await transport(
    remoteUrl,
    syncWithRemote({
      doc,
      remote: undefined,
      shouldSendStateVector: true,
    }),
  )

  await transport(
    remoteUrl,
    syncWithRemote({
      doc,
      remote: remoteData,
      shouldApplyDiff: true,
      shouldSendDiff: true,
    }),
  )

  console.log('Sync complete')

  await saveDoc()
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
