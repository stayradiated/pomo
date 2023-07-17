<script lang="ts">
  import type { PageData } from './$types'
  import LabelGrid from './LabelGrid.svelte'

  export let data: PageData
  const { labelRecord, streamList, commonLabelMap } = data
</script>

<main>
  {#each streamList as stream}
    {@const labelIdList = commonLabelMap.get(stream.id) ?? []}
    <h2>{stream.name}</h2>
    <LabelGrid
      labelRecord={labelRecord}
      labelIdList={labelIdList} />
  {/each}
</main>
