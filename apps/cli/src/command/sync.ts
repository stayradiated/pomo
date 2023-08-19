import { CliCommand } from 'cilly'
import { syncWithRemote } from '@stayradiated/pomo-doc'
import { fetch, FormData } from 'undici'
import { getDoc, saveDoc } from '#src/lib/doc.js'

type HandlerOptions = {
  remoteUrl: string
}

const handler = async (options: HandlerOptions): Promise<void | Error> => {
  const { remoteUrl } = options

  const doc = await getDoc()
  if (doc instanceof Error) {
    return doc
  }

  const syncResult = await syncWithRemote({
    doc,
    async postDiff(request) {
      const { localDiff, localStateVector } = request

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

      return { remoteDiff, remoteStateVector }
    },
  })
  if (syncResult instanceof Error) {
    return syncResult
  }

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
