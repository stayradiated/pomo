<script lang="ts">
  import type { PageData } from './$types'
  import StreamLabelList from './StreamLabelList.svelte'

  export let data: PageData
</script>

<h2>Labels</h2>

{#each data.streamList as stream}
  {@const labelList = data.streamLabelListMap.get(stream.id) ?? []}
  <StreamLabelList {stream} {labelList} />
{/each}
