<script lang="ts">
  import type { PageData } from './$types'
  import { handleFormSubmit } from './actions';

  export let data: PageData
  const { startedAtLocal, streamRecord, pointList } = data

  const handleSubmit = (event: SubmitEvent) => {
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    handleFormSubmit({ doc: data.doc, formData })
  }
</script>

<ul>
  {#each pointList as point}
    <li>
      <strong>{streamRecord[point.streamId]?.name}</strong>
      <code>{point.value}</code>
    </li>
  {/each}
</ul>

<form on:submit|preventDefault={handleSubmit}>
  {#each pointList as point}
    <input type="hidden" name="pointId" value={point.id} />
  {/each}
  <input type="datetime-local" name="startedAtLocal" value={startedAtLocal} />
  <button type="submit">Update</button>
</form>
