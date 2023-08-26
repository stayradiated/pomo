<script lang="ts">
  import PieChart from './pie-chart.svelte'
  import type { PageData } from './$types'
  import { utcToZonedTime } from 'date-fns-tz'
  import * as dateFns from 'date-fns'

  export let data: PageData

  $: zonedInstant = utcToZonedTime(data.instant, data.timeZone)
  $: title = dateFns.format(zonedInstant, 'PPPP')
  $: previousDate = dateFns.format(
    dateFns.subDays(zonedInstant, 1),
    'yyyy-MM-dd',
  )
  $: nextDate = dateFns.format(dateFns.addDays(zonedInstant, 1), 'yyyy-MM-dd')

</script>

<h1>Stats: {title}</h1>

<a href="?date={previousDate}">&lt;</a>
<a href="?">Today</a>
<a href="?date={nextDate}">&gt;</a>

<div>
  <PieChart data={data.chartData} />
</div>
