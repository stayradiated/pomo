<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
  const { startedAtLocal, streamList, currentPoints} = data

  const rowList = streamList.map((stream) => {
    const pointValue = currentPoints.get(stream.id)?.value ?? ''
    return { stream, pointValue }
  })
</script>

<main>
  <form method="POST">
    <input type="datetime-local" name="startedAtLocal" value={startedAtLocal} />

    {#each rowList as row, index}
      <div class="stream-control">
        <label for="edit-stream-{index}">{row.stream.name}</label>
        <input name="stream[{index}].id" value={row.stream.id} type="hidden" />
        <textarea name="stream[{index}].value" id="edit-stream-{index}" value={row.pointValue} />
      </div>
    {/each}

    <button>Save</button>
  </form>
</main>

<style>
  form {
    display: flex;
    flex-direction: column;
  }

  .stream-control {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
  }

  label {
    font-weight: bold;
    line-height: 2rem;
  }

  textarea {
    min-height: 8vh;
    font-size: 18px;
  }

  button {
    line-height: 3rem;
  }
</style>
