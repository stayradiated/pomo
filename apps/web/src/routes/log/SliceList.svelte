<script lang="ts">
  import type { Slice } from '@stayradiated/pomo-core'
  import type { Stream, Label } from '@stayradiated/pomo-doc'
  import * as dateFns from 'date-fns'
  import { durationLocale } from '@stayradiated/pomo-core'
  import { utcToZonedTime } from 'date-fns-tz'

  export let streamList: Stream[]
  export let sliceList: Slice[]
  export let timeZone: string
  export let labelRecord: Record<string, Label>

  const formatTime = (utc: number): string => {
    const time = utcToZonedTime(utc, timeZone)
    return dateFns.format(time, 'HH:mm')
  }

  const formatDuration = (ms: number): string => {
    return (
      dateFns.formatDuration(
        dateFns.intervalToDuration({ start: 0, end: ms }),
        {
          format: ['hours', 'minutes'],
          locale: durationLocale,
        },
      ) || 'now'
    )
  }
</script>

<table>
  <thead>
    <tr>
      <th>time</th>
      {#each streamList as stream}
        <th>{stream.name}</th>
      {/each}
    </tr>
  </thead>

  <tbody>
    {#each sliceList as slice}
      <tr>
        <td
          ><a href="/edit?ref={slice.lineList[0]?.id}"
            >{formatTime(slice.startedAt)}</a
          ></td
        >

        {#each streamList as stream}
          {@const line = slice.lineList.find(
            (line) => line.streamId === stream.id,
          )}

          <td>
            {#if line}
              {(line.labelIdList ?? [])
              .map((labelId) => {
                const label = labelRecord[labelId]
                return (label?.icon ? label?.icon + ' ' : '') + (label?.name ?? '')
              })
                .join(', ')}
              <br />
              <code>{formatDuration(line.durationMs)}</code>
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  td {
    white-space: pre-wrap;
  }
</style>
