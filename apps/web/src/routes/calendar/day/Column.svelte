<script lang="ts">
  import type { Line, Label } from '@stayradiated/pomo-core'
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
    display: flex;
    flex-direction: column;
  }
</style>
