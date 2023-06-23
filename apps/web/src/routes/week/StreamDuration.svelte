<script lang="ts">
  import type { Stream } from '@stayradiated/pomo-core';
  import * as dateFns from 'date-fns';

  export let stream: Stream;
  export let durationMap: Map<string, number>;
  export let streamStartedAt: number | undefined;
  export let streamStoppedAt: number | undefined;

  const formatDuration = (ms: number): string => {
    const hours = Math.floor(ms / 1000 / 60 / 60);
    const minutes = Math.floor(ms / 1000 / 60) % 60;
    const seconds = Math.floor(ms / 1000) % 60;

    const h = hours > 0 ? `${hours}h ` : '';
    const m = minutes > 0 ? `${minutes}m ` : '';
    const s = seconds > 0 ? `${seconds}s` : '';

    return `${h}${m}${s}`;
  }

  const totalDuration = Array.from(durationMap.values()).reduce((a, b) => a + b, 0);
</script>

<div>
  <h3>{stream.name}</h3>
  <pre>{stream.id}</pre>

  <ul>
    {#each Array.from(durationMap.entries()) as [task, duration]}
      <li>{task}: {formatDuration(duration)}</li>
    {/each}
  </ul>

  <p>Started: {streamStartedAt ? dateFns.format(streamStartedAt, 'PPPPpp') : 'N/A'}</p>
  <p>Stopped: {streamStoppedAt ? dateFns.format(streamStoppedAt, 'PPPPpp') : 'N/A'}</p>
  <p>Total: {formatDuration(totalDuration)}</p>
</div>
