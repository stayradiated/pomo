<script lang="ts">
  import { version } from '$lib/constants.js';

  import * as pDoc from '@stayradiated/pomo-doc';
  import { IndexeddbPersistence } from '$lib/y-indexeddb';

  const doc = pDoc.createDoc()

  $: timeZone = 'loading...'
  $: localTimeZone = timeZone

  const provider = new IndexeddbPersistence('pomo', doc)
  provider.on('synced', () => {
    console.log('content from the database is loaded')

    timeZone = pDoc.getUserTimeZone({ doc })
  })

  const changeTimeZone = () => {
    pDoc.transact(doc, () => {
      const result = pDoc.setUserTimeZone({ doc, timeZone: localTimeZone })
      if (result instanceof Error) {
        console.error(result)
      }
    })
    timeZone = pDoc.getUserTimeZone({ doc })
  }
</script>

<h1>Pomo v{version}</h1>

<p>Timezone: {timeZone}</p>

<input type='text' bind:value={localTimeZone} />
<button on:click={changeTimeZone}>Change Timezone</button>
