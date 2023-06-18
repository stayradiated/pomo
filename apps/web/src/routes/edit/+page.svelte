<script lang="ts">
  import { format } from 'date-fns'
  import { utcToZonedTime } from 'date-fns-tz';
  import type { PageData } from "./$types";

  export let data: PageData;
  const { currentTimeUTC, streamList, currentPoints, timeZone } = data

  const rowList = streamList.map((stream) => {
    const pointValue = currentPoints.get(stream.id)?.value ?? ''
    return { stream, pointValue }
  })

  const currentTimeLocal = utcToZonedTime(currentTimeUTC, timeZone)
  const currentTimeLocalString = format(currentTimeLocal, 'PPpp')

  console.log({ currentTimeUTC, timeZone, currentTimeLocal, currentTimeLocalString })
</script>

<main>
  <form method="POST">
    <input name="startedAt" type="hidden" value={currentTimeUTC} />
    <time class="currentTime">{currentTimeLocalString}</time>

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
