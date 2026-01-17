<script lang="ts">
import * as dateFns from 'date-fns'

import type { PageProps } from './$types'

import { query } from '#lib/utils/query.js'
import { startOfDayWithTimeZone } from '#lib/utils/zoned-date.js'

import MultiDaySliceList from '#lib/components/Log/MultiDaySliceList.svelte'

const { data }: PageProps = $props()
const { store } = $derived(data)

import { getSliceList } from '#lib/core/select/slice.js'
import { getTimeZone } from '#lib/core/select/user.js'

const { timeZone, streamList, labelRecord, sliceList } = $derived(
  query(() => {
    const timeZone = getTimeZone(store).value

    const rangeStartDate = startOfDayWithTimeZone({
      instant: dateFns.subDays(Date.now(), 7).getTime(),
      timeZone,
    }).getTime()

    return {
      timeZone,
      userList: store.user.asList.value,
      streamList: store.stream.asList.value,
      labelRecord: store.label.asRecord.value,
      sliceList: getSliceList(store, {
        startedAt: { gte: rangeStartDate },
      }).value.toReversed(),
    }
  }),
)
</script>

<MultiDaySliceList
  {streamList}
  {sliceList}
  {labelRecord}
  {timeZone}
/>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }
</style>
