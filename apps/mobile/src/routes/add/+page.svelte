<script lang="ts">
  import type { PageData } from './$types'
  import StreamStatus from './StreamStatus.svelte'
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
      <StreamStatus
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
  main {
    max-width: var(--width-md);
    margin: 0 auto;
  }

  form {
    display: flex;
    flex-direction: column;
    padding: var(--size-3);
    gap: var(--size-2);
  }

  input {
    background: var(--theme-background);
    color: var(--theme-text-main);
    border: none;
    border-radius: var(--radius-xs);
    line-height: var(--line-xl);
  }

  button {
    line-height: 3rem;
    background: var(--theme-button-base);
    color: var(--theme-text-bright);
    border: var(--size-px) solid var(--theme-border);
    border-radius: var(--radius-xs);
  }
  button:hover {
    background-color: var(--theme-button-hover);
  }
</style>
