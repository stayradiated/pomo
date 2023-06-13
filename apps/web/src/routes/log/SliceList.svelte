<script lang="ts">
  import type { Stream, Slice } from '@stayradiated/pomo-core';
  import { format } from 'date-fns'
  import { stripComments } from '@stayradiated/pomo-core';

  export let streamList: Stream[]
  export let sliceList: Slice[]
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
        <td>{format(slice.startedAt, 'HH:mm')}</td>

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
