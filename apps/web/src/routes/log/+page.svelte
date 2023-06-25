<script lang="ts">
  import type { PageData } from './$types'
  import MultiDaySliceList from './MultiDaySliceList.svelte'

  export let data: PageData
  const {
    labelRecord,
    filterStreamId,
    filterLabelId,
    streamList,
    sliceList,
    timeZone,
  } = data

  let selectedStreamId = filterStreamId
  let selectedLabelId = filterLabelId

  $: streamLabelList = Object.values(labelRecord)
    .filter((label) => label.streamId === selectedStreamId)
    .sort((a, b) => a.name.localeCompare(b.name))
</script>

<form method="POST">
  <select name="stream" placeholder="Stream" bind:value={selectedStreamId}>
    {#each streamList as stream}
      <option value={stream.id}>{stream.name}</option>
    {/each}
  </select>

  <select name="label" placeholder="Label" bind:value={selectedLabelId}>
    {#each streamLabelList as streamLabel}
      <option value={streamLabel.id}>{streamLabel.name}</option>
    {/each}
  </select>

  <button>Filter</button>
  <a href="/log" data-sveltekit-reload class="button">Clear</a>
</form>

<MultiDaySliceList {streamList} {labelRecord} {sliceList} {timeZone} />
