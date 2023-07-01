<script lang="ts">
  import type { PageData } from './$types'
  import PointInput from './PointInput.svelte'

  export let data: PageData
  const { startedAtLocal, streamList, currentPoints, streamLabelRecord } = data
</script>

<main>
  <form method="POST">
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
