<script lang="ts">
  import type { PageData } from './$types'
  import MultiDaySliceList from './MultiDaySliceList.svelte'

  export let data: PageData
</script>

<h1>Pomo</h1>

<MultiDaySliceList
  streamList={data.streamList}
  pointList={data.pointList}
  sliceList={data.sliceList}
/>
