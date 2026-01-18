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
let {
  numberOfDaysInWeek,
  startOfWeek,
  instant,
  timeZone,
  streamList,
  streamLineListByDate,
  labelRecord,
} = $derived(data)

let visibleStreamIdList = $state(data.streamList.map((stream) => stream.id))

let zonedInstant = $derived(toZonedTime(instant, timeZone))
let title = $derived(dateFns.format(zonedInstant, 'PPPP'))

let previousWeek = $derived(
  dateFns.format(dateFns.subWeeks(zonedInstant, 1), 'yyyy-MM-dd'),
)
let nextWeek = $derived(
  dateFns.format(dateFns.addWeeks(zonedInstant, 1), 'yyyy-MM-dd'),
)

const handleLeft = (_detail: ShortcutEventDetails) => {
  goto(`?date=${previousWeek}`)
}
const handleRight = (_detail: ShortcutEventDetails) => {
  goto(`?date=${nextWeek}`)
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

<a href="?date={previousWeek}">&lt;</a>
<a href="?">Today</a>
<a href="?date={nextWeek}">&gt;</a>

{#each streamList as stream (stream.id)}
	<input type="checkbox" bind:group={visibleStreamIdList} value={stream.id} id={stream.id} />
	<label for={stream.id}>{stream.name}</label>
{/each}

<h2>{title}</h2>

<div class="container">
	<Paper {numberOfDaysInWeek} {startOfWeek} />
	<div class="inner">
		{#each Array.from(streamLineListByDate.values()) as streamLineList, index (index)}
			<div class="day">
				{#each visibleStreamIdList as streamId (streamId)}
					{@const lineList = streamLineList.get(streamId) ?? []}
					<Column {lineList} {labelRecord} />
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		position: relative;
		height: 1500px;
	}
	.inner {
		position: absolute;
		top: 60px;
		left: 50px;
		right: 0;
		display: flex;
	}
	.day {
		flex: 1;
		overflow: hidden;
		position: relative;
		display: flex;
		margin: 0 0.5rem;
	}
</style>
