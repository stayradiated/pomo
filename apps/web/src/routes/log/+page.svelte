<script lang="ts">
  import type { PageData } from './$types'
  import MultiDaySliceList from './MultiDaySliceList.svelte'

  export let data: PageData
</script>

<MultiDaySliceList
  streamList={data.streamList}
  sliceList={data.sliceList}
/>
