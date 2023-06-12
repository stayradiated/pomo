<script lang="ts">
  import type { Stream, Slice } from '@stayradiated/pomo-core';
  import { format } from 'date-fns'

  import SliceList from './SliceList.svelte'

  export let streamList: Stream[]
  export let sliceList: Slice[]

  const sliceListByDay = sliceList.reduce<Map<string, Slice[]>>(
    (acc, slice) => {
      // Format as Friday 02 June 2023
      const day = format(slice.startedAt, 'EEEE dd MMMM yyyy')
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
    <p color="#888">{day}</p>
    <SliceList
      streamList={streamList}
      sliceList={sliceList}
    />
  </div>
{/each}

<style>
  .container {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
</style>
