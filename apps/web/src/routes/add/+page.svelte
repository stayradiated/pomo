<script lang="ts">
import * as dateFns from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

import type { PageProps } from './$types'

import { getTimeZone } from '#lib/core/select/user.js'

import { clock } from '#lib/utils/clock.js'
import { query } from '#lib/utils/query.js'

import StreamStatus from './StreamStatus.svelte'

let { data }: PageProps = $props()
const { store } = $derived(data)

const { timeZone, streamList } = $derived(
  query({
    timeZone: getTimeZone(store),
    streamList: store.stream.asList,
  }),
)

let currentTime = $state(clock.value)
let [nowDate, nowTime] = $derived.by(() => {
  return formatInTimeZone(currentTime, timeZone, "yyyy-MM-dd'T'HH:mm").split(
    'T',
  )
})

const handleSubmit = async (event: SubmitEvent) => {
  event.preventDefault()

  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  console.info(formData)
}

const handleNow = (event: MouseEvent) => {
  event.preventDefault()
  currentTime = clock.value
}
</script>

<main>
  <form onsubmit={handleSubmit}>
    {#each streamList as stream (stream.id)}
      <StreamStatus
        {store}
        {stream}
        {currentTime}
      />
    {/each}

    <div class="datetime-row">
      <input
        required
        type="date"
        class="date-input"
        name="startedAtDate"
        bind:value={nowDate}
      />
      <input
        required
        type="time"
        class="time-input"
        name="startedAtTime"
        bind:value={nowTime}
      />

      <p class="datetime-relative">
        {dateFns.formatDistanceToNow(currentTime, { includeSeconds: true, addSuffix: true })}
      </p>
      <button class="now-button" onclick={handleNow}>Now</button>
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
      'date-input time-input now'
      'datetime-relative datetime-relative datetime-relative';
    gap: var(--size-2);
  }

  .date-input {
    grid-area: date-input;
  }
  .time-input {
    grid-area: time-input;
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
