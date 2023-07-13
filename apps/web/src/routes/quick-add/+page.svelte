<script lang="ts">
  import type { PageData } from './$types'
  import LabelGrid from './LabelGrid.svelte'

  export let data: PageData
  const { labelRecord, interestingLabelIds } = data
</script>

<main>
  <h2>Location</h2>
    <LabelGrid
      labelRecord={labelRecord}
      labelIdList={interestingLabelIds} />
</main>
