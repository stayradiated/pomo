<script lang="ts">
import type { PageData } from './$types.js'
import * as dateFns from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { shortcut, type ShortcutEventDetails } from '@svelte-put/shortcut'
import { goto } from '$app/navigation'

import Column from './Column.svelte'
import Paper from './Paper.svelte'

interface Props {
  data: PageData
}

let { data }: Props = $props()
let zonedInstant = $derived(toZonedTime(data.instant, data.timeZone))
let title = $derived(dateFns.format(zonedInstant, 'PPPP'))

let previousDate = $derived(
  dateFns.format(dateFns.subDays(zonedInstant, 1), 'yyyy-MM-dd'),
)
let nextDate = $derived(
  dateFns.format(dateFns.addDays(zonedInstant, 1), 'yyyy-MM-dd'),
)

const handleLeft = (_detail: ShortcutEventDetails) => {
  goto(`?date=${previousDate}`)
}
const handleRight = (_detail: ShortcutEventDetails) => {
  goto(`?date=${nextDate}`)
}
</script>

<svelte:window
	use:shortcut={{
		trigger: [
			{ key: 'h', callback: handleLeft },
			{ key: 'l', callback: handleRight },
			{ key: 'ArrowLeft', callback: handleLeft },
			{ key: 'ArrowRight', callback: handleRight }
		]
	}}
/>

<a href="?date={previousDate}">&lt;</a>
<a href="?">Today</a>
<a href="?date={nextDate}">&gt;</a>

<h2>{title}</h2>

<div class="container">
	<Paper />
	<div class="inner">
		{#each data.streamList as stream (stream.id)}
			<Column
				lineList={data.streamLineListMap.get(stream.id) ?? []}
				labelRecord={data.labelRecord}
			/>
		{/each}
	</div>
</div>

<style>
	.container {
		position: relative;
	}
	.inner {
		position: absolute;
		top: 0;
		left: 60px;
		width: calc(100% - 60px);
		display: flex;
	}
</style>
