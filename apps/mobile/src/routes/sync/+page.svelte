<script lang="ts">
  import { createDoc } from '@stayradiated/pomo-doc';
  import { IndexeddbPersistence } from '$lib/y-indexeddb';
  import { markDocAsStale, syncLogs } from '$lib/sync.js';

  const doc = createDoc()
  const provider = new IndexeddbPersistence('pomo', doc)
  provider.on('synced', () => {
    console.log('content from the database is loaded')
  })

  const handleSync = async () => {
    await markDocAsStale(doc)
  }
</script>

<h1>Sync</h1>

<button on:click={handleSync}>Sync</button>

<pre>
  <code>{JSON.stringify($syncLogs, null, 2)}</code>
</pre>
