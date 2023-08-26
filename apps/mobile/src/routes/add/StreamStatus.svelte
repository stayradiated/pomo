<script lang="ts">
  import type { Stream, Point, Label } from '@stayradiated/pomo-doc'

  import PointInput from './PointInput.svelte'

  export let streamIndex: number
  export let stream: Stream
  export let defaultPoint: Point | undefined
  export let labelRecord: Record<string, Label>

  const defaultPointLabels = (defaultPoint?.labelIdList ?? []).map((id) => labelRecord[id])

  $: editMode = false

  const handleClick = () => {
    console.log('hello world')
    editMode = true
  }
</script>

<input name="stream[{streamIndex}].id" value={stream.id} type="hidden" />
<input name="stream[{streamIndex}].type" value={editMode ? 'edit' : 'skip'} type="hidden" />

{#if editMode}
  <PointInput
    {stream}
    {streamIndex}
    defaultPoint={defaultPoint}
    labelRecord={labelRecord}
  />
{:else}
  <button class="container" on:click|preventDefault={handleClick}>
    <div class="label">{stream.name}</div>
    <div class="current-value">
      {#each defaultPointLabels as label}
        {label.icon ?? ''} {label.name}
      {/each}
      {#if defaultPointLabels.length === 0}
        -- 
      {/if}
    </div>
  </button>
{/if}

<style>
  .container {
    padding: 0 var(--size-3);
    background: var(--theme-background);
    border: none;
    color: var(--theme-text-main);
    border-radius: var(--radius-xs);
    cursor: pointer;

    display: flex;
    justify-content: space-between;
    line-height: var(--line-xl);
    border-bottom: 1px solid var(--theme-border);
  }
  .container:hover {
    background-color: var(--theme-background-alt);
  }

  .label {
    font-weight: var(--weight-bold);
  }
</style>
