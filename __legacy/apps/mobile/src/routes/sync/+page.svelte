<script lang="ts">
import { syncLogs } from '$lib/sync.js'
import * as dateFns from 'date-fns'
import type { PageData } from './$types.js'

interface Props {
  data: PageData
}

let { data }: Props = $props()
</script>

<h1>Sync</h1>

<button onclick={data.handleSync}>Sync</button>

<ul>
	{#each $syncLogs as log, index (index)}
		{@const ts = dateFns.format(log.ts, 'pp')}
		<li>
			<strong>{ts}</strong>
			<pre>{log.message}</pre>
		</li>
	{/each}
</ul>

<style>
	pre {
		white-space: pre-wrap;
	}
</style>
