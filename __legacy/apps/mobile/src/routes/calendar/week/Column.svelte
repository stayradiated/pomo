<script lang="ts">
import type { Line } from '@stayradiated/pomo-core'
import type { Label } from '@stayradiated/pomo-doc'
import Cell from './Cell.svelte'

interface Props {
  lineList: Line[]
  labelRecord: Record<string, Label>
}

let { lineList, labelRecord }: Props = $props()
</script>

<div class="grid">
	{#each lineList as line (line.id)}
		<Cell {line} {labelRecord} />
	{/each}
</div>

<style>
	.grid {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
