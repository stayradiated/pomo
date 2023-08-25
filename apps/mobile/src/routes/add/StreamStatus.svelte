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

{#if editMode}
  <PointInput
    {stream}
    {streamIndex}
    defaultPoint={defaultPoint}
    labelRecord={labelRecord}
  />
{:else}
  <button class="container" on:click|preventDefault={handleClick}>
    <label>{stream.name}</label>
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
    background: var(--color-grey-100);

    display: flex;
    justify-content: space-between;
    line-height: var(--line-xl);
    border-bottom: 1px solid var(--color-grey-300);
  }

  label {
    font-weight: var(--weight-bold);
  }
</style>
