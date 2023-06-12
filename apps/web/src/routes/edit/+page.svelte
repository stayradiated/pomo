<script lang="ts">
  import { format } from 'date-fns'
  import type { PageData } from "./$types";
  export let data: PageData;
  const { currentTime, streamList, currentPoints } = data

  const rowList = streamList.map((stream) => {
    const pointValue = currentPoints.get(stream.id)?.value ?? ''
    return { stream, pointValue }
  })
</script>

<form method="POST">
  <input name="currentTime" type="hidden" value={currentTime.toISOString()} />
  <p class="currentTime">{format(currentTime, 'PPpp')}</p>
  {#each rowList as row, index}
    <div class="stream-control">
      <label for="edit-stream-{index}">{row.stream.name}</label>
      <textarea name="stream-{row.stream.id}" id="edit-stream-{index}" value={row.pointValue} />
    </div>
  {/each}

  <button>Save</button>
</form>

<style>
  .currentTime {
    font-weight: bold;
    font-family: monospace;
    font-size: 16px;
  }

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
