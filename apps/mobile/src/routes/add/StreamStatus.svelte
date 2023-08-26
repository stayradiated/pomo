<script lang="ts">
  import type { Stream, Point, Label } from '@stayradiated/pomo-doc'
  import { formatDurationRough } from '@stayradiated/pomo-core'

  import PointInput from './PointInput.svelte'

  export let streamIndex: number
  export let stream: Stream
  export let currentTime: number
  export let currentPoint: Point | undefined
  export let labelRecord: Record<string, Label>

  const currentPointLabelList = (currentPoint?.labelIdList ?? []).map((id) => labelRecord[id])

  $: editMode = false
</script>

<input name="stream[{streamIndex}].id" value={stream.id} type="hidden" />
<input name="stream[{streamIndex}].type" value={editMode ? 'edit' : 'skip'} type="hidden" />

{#if editMode}
  <PointInput
    {stream}
    {streamIndex}
    defaultPoint={currentPoint}
    labelRecord={labelRecord}
    onReset={() => editMode = false}
  />
{:else}
  <button class="container" on:click|preventDefault={() => editMode = true}>
    <div class="label">{stream.name}</div>
    <div class="value">
      {#if currentPointLabelList.length === 0}
        --
      {:else}
        {#each currentPointLabelList as label}
          {label.icon ?? ''} {label.name}
        {/each}
      {/if}
    </div>
    <div class="duration">
      {currentPoint
      ? (formatDurationRough(currentTime - currentPoint?.startedAt))
      : ''}
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

    display: grid;
    grid-template-areas:
      "label value"
      "label duration";

    justify-content: space-between;
    line-height: var(--line-xl);
    border-bottom: 1px solid var(--theme-border);
  }
  .container:hover {
    background-color: var(--theme-background-alt);
  }

  .label {
    font-weight: var(--weight-bold);
    grid-area: label;
    font-size: var(--scale-1);
  }

  .value {
    grid-area: value;
    text-align: right;
    font-size: var(--scale-1);
  }

  .duration {
    grid-area: duration;
    text-align: right;
    font-size: var(--scale-0);
    color: var(--theme-text-muted);
  }
</style>
