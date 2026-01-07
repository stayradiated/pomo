<script lang="ts">
import type { Store } from '#lib/core/replicache/store.js'
import type { Stream } from '#lib/types.local.js'

import { getPointAtTime } from '#lib/core/select/point.js'

import { formatDurationRough } from '#lib/utils/format-duration.js'
import { query } from '#lib/utils/query.js'

import PointInput from './PointInput.svelte'

type Props = {
  store: Store
  stream: Stream
  currentTime: number
}

const { store, stream, currentTime }: Props = $props()

const { currentPoint, labelList } = $derived(
  query(() => {
    const currentPoint = getPointAtTime(store, stream.id, currentTime).value
    const labelList = (currentPoint?.labelIdList ?? []).flatMap((labelId) => {
      return store.label.get(labelId).value ?? []
    })
    return { currentPoint, labelList }
  }),
)

let editMode = $state(false)

const handleEdit = (event: MouseEvent) => {
  event.preventDefault()
  editMode = true
}
</script>

<input name="stream.{stream.id}.id" value={stream.id} type="hidden" />
<input name="stream.{stream.id}.type" value={editMode ? 'edit' : 'skip'} type="hidden" />

{#if editMode}
  <PointInput
    {store}
    {stream}
    defaultPoint={currentPoint}
    onReset={() => (editMode = false)}
  />
{:else}
  <button class="container" onclick={handleEdit}>
    <div class="label">{stream.name}</div>
    <div class="value">
      {#if labelList.length === 0}
        --
      {:else}
        {#each labelList as label (label.id)}
          {label.icon ?? ''} {label.name}
        {/each}
      {/if}
    </div>
    <div class="duration">
      {currentPoint ? formatDurationRough(currentTime - currentPoint?.startedAt) : ''}
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
			'label value'
			'label duration';

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
