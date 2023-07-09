<script lang="ts">
  import type { PageData } from './$types'
  import StreamLabelList from './StreamLabelList.svelte'

  export let data: PageData

  $:({ streamList, labelRecord, streamLabelListMap } = data)
</script>

<h2>Labels</h2>

{#each streamList as stream}
  {@const labelListMap = streamLabelListMap.get(stream.id)}
  {#if labelListMap}
    <StreamLabelList {stream} {labelListMap} {labelRecord} />
  {/if}
{/each}
