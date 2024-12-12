<script lang="ts">
import type { PageData } from './$types'
import LabelGrid from './LabelGrid.svelte'

interface Props {
  data: PageData
}

let { data }: Props = $props()
const { labelRecord, streamList, commonLabelMap } = data
</script>

<main>
	{#each streamList as stream}
		{@const labelIdList = commonLabelMap.get(stream.id) ?? []}
		<h2>{stream.name}</h2>
		<LabelGrid {labelRecord} {labelIdList} />
	{/each}
</main>
