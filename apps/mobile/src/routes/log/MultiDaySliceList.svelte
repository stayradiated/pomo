<script lang="ts">
import type { Slice } from '@stayradiated/pomo-core'
import type { Stream, Label } from '@stayradiated/pomo-doc'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

import SliceList from './SliceList.svelte'

interface Props {
  streamList: Stream[]
  sliceList: Slice[]
  timeZone: string
  labelRecord: Record<string, Label>
}

let { streamList, sliceList, timeZone, labelRecord }: Props = $props()

let sliceListByDay = $derived(
  sliceList.reduce<Map<string, Slice[]>>((acc, slice) => {
    const { startedAt: startedAtUTC } = slice
    const startedAt = toZonedTime(startedAtUTC, timeZone)

    // Format as Friday 02 June 2023
    const day = format(startedAt, 'EEEE dd MMMM yyyy')

    const list: Slice[] = acc.get(day) ?? []
    list.push(slice)
    acc.set(day, list)
    return acc
  }, new Map()),
)
</script>

{#each Array.from(sliceListByDay.entries()) as [day, sliceList]}
	<div class="container">
		<h2>{day}</h2>
		<SliceList {streamList} {sliceList} {timeZone} {labelRecord} />
	</div>
{/each}

<style>
	.container {
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
	}
</style>
