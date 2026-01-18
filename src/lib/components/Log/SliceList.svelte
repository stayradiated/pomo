<script lang="ts">
import type { Slice } from '#lib/core/select/types.js'
import type { Label, Stream } from '#lib/types.local.js'

import { formatDuration, formatTime } from '#lib/utils/format-duration.js'

interface Props {
  streamList: Stream[]
  sliceList: Slice[]
  timeZone: string
  labelRecord: Record<string, Label>
}

let { streamList, sliceList, timeZone, labelRecord }: Props = $props()
</script>

<table>
  <thead>
    <tr>
      <th>time</th>
      {#each streamList as stream (stream.id)}
        <th>{stream.name}</th>
      {/each}
    </tr>
  </thead>

  <tbody>
    {#each sliceList as slice, index (index)}
      <tr>
        <td><a href="/edit/slice/{slice.startedAt}">{formatTime(timeZone, slice.startedAt)}</a></td>

        {#each streamList as stream (stream.id)}
          {@const line = slice.lineList.find((line) => line.streamId === stream.id)}

          <td>
            {#if line}
              {(line.labelIdList ?? [])
                .map((labelId) => {
                  const label = labelRecord[labelId];
                  return (label?.icon ? label?.icon + ' ' : '') + (label?.name ?? '');
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
