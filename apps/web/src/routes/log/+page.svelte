<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types'
  import MultiDaySliceList from './MultiDaySliceList.svelte'

  export let data: PageData
</script>

<form method="GET" use:enhance>
  <select name="stream" placeholder="Stream" value={ data.filterStreamId ?? '' }>
    {#each data.streamList as stream}
      <option value={stream.id}>{stream.name}</option>
    {/each}
  </select>
  <input type="text" name="value" placeholder="Value" value={ data.filterValue ?? '' } />
</form>

<MultiDaySliceList
  streamList={data.streamList}
  sliceList={data.sliceList}
/>
