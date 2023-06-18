<script lang="ts">
  import type { Stream, Slice } from '@stayradiated/pomo-core';
  import { format } from 'date-fns'
  import { stripComments } from '@stayradiated/pomo-core';
  import { utcToZonedTime } from 'date-fns-tz';

  export let streamList: Stream[]
  export let sliceList: Slice[]
  export let timeZone: string

  const formatTime = (utc: number): string => {
    const time = utcToZonedTime(utc, timeZone)
    return format(time, 'HH:mm')
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
        <td><a href='/fix?ref={slice.lineList[0]?.id}'>{formatTime(slice.startedAt)}</a></td>

        {#each streamList as stream}
          {@const line = slice.lineList.find((line) => line.streamId === stream.id)}
          <td>{line ? stripComments(line.value) : ''}<br />
          {#if line}
            <code>{Math.round(line.durationMs / 1000 / 60)}min</code>
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
