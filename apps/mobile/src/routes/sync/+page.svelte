<script lang="ts">
  import { syncLogs } from '$lib/sync.js';
  import * as dateFns from 'date-fns'
  import type { PageData } from './$types.js';

  export let data: PageData
</script>

<h1>Sync</h1>

<button on:click={data.handleSync}>Sync</button>

<ul>
  {#each $syncLogs as log}
    {@const ts = dateFns.format(log.ts, 'pp')}
    <li><strong>{ts}</strong><pre>{log.message}</pre></li>
  {/each}
</ul>

<style>
  pre {
    white-space: pre-wrap;
  }
</style>
