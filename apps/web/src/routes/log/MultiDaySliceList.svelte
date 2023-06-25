<script lang="ts">
  import type { Stream, Slice, Label } from '@stayradiated/pomo-core'
  import { format } from 'date-fns'
  import { utcToZonedTime } from 'date-fns-tz'

  import SliceList from './SliceList.svelte'

  export let streamList: Stream[]
  export let sliceList: Slice[]
  export let timeZone: string
  export let labelRecord: Record<string, Label>

  const sliceListByDay = sliceList.reduce<Map<string, Slice[]>>(
    (acc, slice) => {
      const { startedAt: startedAtUTC } = slice
      const startedAt = utcToZonedTime(startedAtUTC, timeZone)

      // Format as Friday 02 June 2023
      const day = format(startedAt, 'EEEE dd MMMM yyyy')

      const list: Slice[] = acc.get(day) ?? []
      list.push(slice)
      acc.set(day, list)
      return acc
    },
    new Map(),
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
