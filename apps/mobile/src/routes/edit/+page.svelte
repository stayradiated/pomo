<script lang="ts">
import type { PageData } from './$types'
import { handleFormSubmit } from './actions'

interface Props {
  data: PageData
}

let { data }: Props = $props()
const { startedAtLocal, streamRecord, pointList } = data

const handleSubmit = (event: SubmitEvent) => {
  event.preventDefault()

  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  handleFormSubmit({ doc: data.doc, formData })
}
</script>

<ul>
	{#each pointList as point (point.id)}
		<li>
			<strong>{streamRecord[point.streamId]?.name}</strong>
			<code>{point.value}</code>
		</li>
	{/each}
</ul>

<form onsubmit={handleSubmit}>
	{#each pointList as point (point.id)}
		<input type="hidden" name="pointId" value={point.id} />
	{/each}
	<input type="datetime-local" name="startedAtLocal" value={startedAtLocal} />
	<button type="submit">Update</button>
</form>
