<script lang="ts">
  import type { Line } from "@stayradiated/pomo-core";
  import * as dateFns from 'date-fns';

  import { formatDuration } from './utils.js';

  export let lineList: Line[];

  const totalDuration = lineList.reduce((total, line) => total + line.durationMs, 0);
</script>

<div class='grid'>
  {#each lineList as line}
    <div style="height: {line.durationMs / 1000 / 60}px">{line.value}</div>
    <div>{dateFns.format(line.startedAt, 'pp')}</div>
    <div>+{formatDuration(line.durationMs)}</div>
  {/each}
</div>

<div>Total: {formatDuration(totalDuration)}</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .grid > *:nth-child(6n + 1), 
  .grid > *:nth-child(6n + 2), 
  .grid > *:nth-child(6n + 3) {
    background: #eee;
  }

  .grid > * {
    overflow: hidden;
  }
</style>
