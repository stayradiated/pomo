<script lang="ts">
  import type { PageData } from './$types'
  import PointInput from './PointInput.svelte'
  import { handleFormSubmit } from './actions';

  export let data: PageData
  const { startedAtLocal, streamList, currentPoints, streamLabelRecord } = data

  const handleSubmit = async (event: SubmitEvent) => {
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    await handleFormSubmit({ doc: data.doc, formData })
  }
</script>

<main>
  <form on:submit|preventDefault={handleSubmit}>
    <input type="datetime-local" name="startedAtLocal" value={startedAtLocal} />

    {#each streamList as stream, streamIndex}
      {@const point = currentPoints.get(stream.id)}
      <PointInput
        {stream}
        {streamIndex}
        defaultPoint={point}
        labelRecord={streamLabelRecord[stream.id] ?? {}}
      />
    {/each}

    <button>Save</button>
  </form>
</main>

<style>
  form {
    display: flex;
    flex-direction: column;
  }

  button {
    line-height: 3rem;
  }
</style>
