<script lang="ts">
  import MultiDaySliceList from './MultiDaySliceList.svelte'
  import type { PageData } from './$types';

  export let data: PageData

  let selectedStreamId = data.filterStreamId
  let selectedLabelId = data.filterLabelId

  $: streamLabelList = Object.values(data.labelRecord)
    .filter((label) => label.streamId === selectedStreamId)
    .sort((a, b) => a.name.localeCompare(b.name))
</script>

<form method="GET">
  <select name="stream" placeholder="Stream" bind:value={selectedStreamId}>
    {#each data.streamList as stream}
      <option value={stream.id}>{stream.name}</option>
    {/each}
  </select>

  <select name="label" placeholder="Label" bind:value={selectedLabelId}>
    {#each streamLabelList as streamLabel}
      <option value={streamLabel.id}>{streamLabel.name}</option>
    {/each}
  </select>

  <button>Filter</button>
  <a href="?" class="button">Clear</a>
</form>

<MultiDaySliceList
  streamList={data.streamList}
  labelRecord={data.labelRecord}
  sliceList={data.sliceList}
  timeZone={data.timeZone}
/>
