<script lang="ts">
  import type { PageData } from './$types'
  import StreamStatus from './StreamStatus.svelte'
  import { handleFormSubmit } from './actions';
  import * as dateFns from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz';

  export let data: PageData
  const { startedAtLocal: defaultStartedAtLocal, streamList, currentPointMap, streamLabelRecord } = data

  $: startedAtLocal = defaultStartedAtLocal
  $: currentTime = new Date(startedAtLocal).getTime()
  $: [tmpDate, tmpTime] = startedAtLocal.split('T')

  const handleSubmit = async (event: SubmitEvent) => {
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    await handleFormSubmit({ doc: data.doc, formData })
  }

  const handleNow = () => {
    startedAtLocal = formatInTimeZone(Date.now(), data.timeZone, "yyyy-MM-dd'T'HH:mm");
  }
</script>

<main>
  <form on:submit|preventDefault={handleSubmit}>

    {#each streamList as stream, streamIndex}
      {@const point = currentPointMap.get(stream.id)}
      <StreamStatus
        {stream}
        {streamIndex}
        {currentTime}
        currentPoint={point}
        labelRecord={streamLabelRecord[stream.id] ?? {}}
      />
    {/each}

    <div class="datetime-row">
      <input class="datetime-input" type="datetime-local" name="startedAtLocal" bind:value={startedAtLocal} />

      <input type="date" value={tmpDate} />
      <input type="time" value={tmpTime} />

      <p class="datetime-relative">{dateFns.formatDistanceToNow(currentTime, { includeSeconds: true, addSuffix: true })}</p>
      <button class="now-button" on:click|preventDefault={handleNow}>Now</button>
    </div>

    <button class="save-button">Save</button>
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

  .save-button {
    line-height: 3rem;
    background: var(--theme-button-base);
    color: var(--theme-text-bright);
    border: var(--size-px) solid var(--theme-border);
    border-radius: var(--radius-xs);
  }
  .save-button:hover {
    background-color: var(--theme-button-hover);
  }

  .datetime-row {
    display: grid;
    grid-template-areas:
      "datetime-input now"
      "datetime-relative datetime-relative"
  }

  .datetime-input {
    grid-area: datetime-input;
  }

  .datetime-relative {
    text-align: right;
    color: var(--theme-text-muted);
    grid-area: datetime-relative;
    text-align: center;
    margin: 0;
    line-height: var(--line-md);
  }

  .now-button {
    background: none;
    border: none;
    cursor: pointer;
    grid-area: now;
    text-transform: uppercase;
    font-size: var(--scale-000);
    color: var(--theme-text-muted);
    font-weight: var(--weight-bold);
  }
  .now-button:hover {
    color: var(--theme-text-main);
  }
</style>
