<script lang="ts">
  import { createDoc, syncWithRemote } from '@stayradiated/pomo-doc';
  import type { SyncTransportData } from '@stayradiated/pomo-doc';
  import { IndexeddbPersistence } from '$lib/y-indexeddb';

  const doc = createDoc()
  const provider = new IndexeddbPersistence('pomo', doc)
  provider.on('synced', () => {
    console.log('content from the database is loaded')
  })

  const remoteUrl = '/api/sync'

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

    return { diff: remoteDiff, stateVector: remoteStateVector }
  }

  const handleSync = async () => {
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
  }
</script>

<h1>Sync</h1>

<button on:click={handleSync}>Sync</button>
