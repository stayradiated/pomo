<script lang="ts">
  import * as pDoc from '@stayradiated/pomo-doc';
  import { IndexeddbPersistence } from '$lib/y-indexeddb';

  const doc = pDoc.createDoc()
  const provider = new IndexeddbPersistence('pomo', doc)
  provider.on('synced', () => {
    console.log('content from the database is loaded')
  })

  const remoteUrl = '/api/sync'

  const handleSync = async () => {
    const result = await pDoc.syncWithRemote({
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

        const response = await fetch(remoteUrl, {
          method: 'POST',
          body: formData,
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
    if (result instanceof Error) {
      console.error(result)
    } else {
      console.log('synced!')
      console.log(doc)
    }
  }
</script>

<h1>Sync</h1>

<button on:click={handleSync}>Sync</button>
