<script lang="ts">
  import type { Line } from '@stayradiated/pomo-core'
  import type { Label } from '@stayradiated/pomo-doc'
  import Cell from './Cell.svelte'

  export let lineList: Line[]
  export let labelRecord: Record<string, Label>
</script>

<div class="grid">
  {#each lineList as line}
    <Cell {line} {labelRecord} />
  {/each}
</div>

<style>
  .grid {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
