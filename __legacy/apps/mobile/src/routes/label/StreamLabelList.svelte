<script lang="ts">
import type { Doc, Stream, Label } from '@stayradiated/pomo-doc'
import { handleDeleteFormSubmit } from './actions.js'

interface Props {
  stream: Stream
  labelListMap: Map<string | null, Label[]>
  labelRecord: Record<string, Label>
  doc: Doc
}

let { stream, labelListMap, labelRecord, doc }: Props = $props()

let labelIdList = $derived(
  Array.from(labelListMap.values()).flatMap((list) =>
    list.map((label) => label.id),
  ),
)

let selected: string[] = $state([])
let selectedAll = $derived(selected.length === labelIdList.length)

const handleToggleAll = (event: Event) => {
  const target = event.target as HTMLInputElement
  const checked = target.checked

  if (checked) {
    selected = labelIdList
  } else {
    selected = []
  }
}

let toggleHtmlId = $derived(`stream-${stream.id}-all`)

const handleSubmit = async (event: SubmitEvent) => {
  event.preventDefault()

  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  handleDeleteFormSubmit({ doc, formData })
}
</script>

<h3>{stream.name}</h3>

<form onsubmit={handleSubmit}>
	<input type="hidden" name="stream" value={stream.id} />
	<input type="submit" name="action:delete" value="Delete" />

	<ul>
		<li>
			<input
				type="checkbox"
				id={toggleHtmlId}
				onchange={handleToggleAll}
				checked={selectedAll}
				autocomplete="off"
			/>
			<label for={toggleHtmlId}><strong>Select All</strong></label>
		</li>
		{#each Array.from(labelListMap.entries()) as [parentId, labelList] (parentId)}
			{#if typeof parentId === 'string'}
				{@const parent = labelRecord[parentId]}
				<h3>{parent.name}</h3>
			{/if}

			{#each labelList as label (label.id)}
				{@const htmlId = `stream-${stream.id}-label-${label.id}`}
				<li>
					<input
						type="checkbox"
						id={htmlId}
						name="label"
						value={label.id}
						bind:group={selected}
						autocomplete="off"
					/>
					<label for={htmlId}>
						<div style="background-color: {label.color};" class="color-swatch"></div>
						<a href="./label/{label.id}">{label.icon ? label.icon + ' ' : ''}{label.name}</a>
					</label>
				</li>
			{/each}
		{/each}
	</ul>
</form>

<style>
	.color-swatch {
		display: inline-block;
		width: 1em;
		height: 1em;
		border-radius: 0.5em;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
		vertical-align: middle;
	}
</style>
