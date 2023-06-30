<script lang="ts">
  import type { PageData } from './$types.js'
  import * as dateFns from 'date-fns'
  import { utcToZonedTime } from 'date-fns-tz'

  import Column from './Column.svelte'
  import Paper from './Paper.svelte'

  export let data: PageData
  const { instant, timeZone, streamList, labelRecord, streamLineListMap } = data

  const zonedInstant = utcToZonedTime(instant, timeZone)
  const title = dateFns.format(zonedInstant, 'PPPP')

  const todaysDate = dateFns.format(
    utcToZonedTime(Date.now(), timeZone),
    'yyyy-MM-dd',
  )
  const previousDate = dateFns.format(
    dateFns.subDays(zonedInstant, 1),
    'yyyy-MM-dd',
  )
  const nextDate = dateFns.format(
    dateFns.addDays(zonedInstant, 1),
    'yyyy-MM-dd',
  )
</script>

<a data-sveltekit-reload href="?date={previousDate}">&lt;</a>
<a data-sveltekit-reload href="?date={todaysDate}">Today</a>
<a data-sveltekit-reload href="?date={nextDate}">&gt;</a>

<h2>{title}</h2>

<div class="container">
  <Paper />
  <div class="inner">
    {#each streamList as stream}
      <Column lineList={streamLineListMap.get(stream.id) ?? []} {labelRecord} />
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
