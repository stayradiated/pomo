<script lang="ts">
import type { PageData } from './$types.js'
import {
  formatDurationHMS,
  formatDurationRough,
  eachDayOfIntervalWithTimeZone,
  eachWeekOfIntervalWithTimeZone,
} from '@stayradiated/pomo-core'
import * as dateFns from 'date-fns'
import * as dateFnsTz from 'date-fns-tz'

interface Props {
  data: PageData
}

let { data }: Props = $props()

let sumMap = $derived(data.sumMap)
let stream = $derived(data.stream)
let labelList = $derived(data.labelList)
let timeZone = $derived(data.timeZone)
let rangeStartDate = $derived(data.rangeStartDate)
let rangeEndDate = $derived(data.rangeEndDate)

let weekRange = $derived(
  eachWeekOfIntervalWithTimeZone({
    timeZone,
    startDate: rangeStartDate,
    endDate: rangeEndDate,
  }),
)
</script>

<h1>Goals</h1>

<h2>Stream: {stream.name}</h2>
<h3>Labels: {labelList.map((label) => label.name).join(', ')}</h3>

<ol>
	{#each weekRange as weekStart}
		{@const weekEnd = dateFns.addDays(weekStart, 6)}
		{@const dateRange = eachDayOfIntervalWithTimeZone({
			timeZone,
			startDate: weekStart.getTime(),
			endDate: weekEnd.getTime()
		})}
		<li>
			<ol>
				{#each dateRange as date}
					{@const entry = sumMap.get(date.getTime()) ?? 0}
					<li>
						{dateFnsTz.formatInTimeZone(date, timeZone, 'PPPP')}: {formatDurationHMS(entry)} ({formatDurationRough(
							entry
						)})
					</li>
				{/each}
			</ol>
		</li>
		<li>
			Total: {formatDurationRough(
				dateRange.map((date) => sumMap.get(date.getTime()) ?? 0).reduce((a, b) => a + b, 0)
			)}
		</li>
	{/each}
</ol>
