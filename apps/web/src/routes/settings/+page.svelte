<script lang="ts">
import type { StreamId } from '#lib/ids.js'
import type { PageProps } from './$types'

import { getStreamList } from '#lib/core/select/stream.js'

import { genId } from '#lib/utils/gen-id.js'
import { query } from '#lib/utils/query.js'

const { data }: PageProps = $props()
const { store } = $derived(data)

const { streamList } = $derived(
  query({
    streamList: getStreamList(store),
  }),
)

const handleCreateStream = async () => {
  const name = prompt('Stream Name')
  if (!name) {
    return
  }

  await store.mutate.stream_create({
    streamId: genId(),
    name,
  })
}

const handleMoveStreamUp = async (streamId: StreamId) => {
  await store.mutate.stream_sort({
    streamId,
    delta: -1,
  })
}

const handleMoveStreamDown = async (streamId: StreamId) => {
  await store.mutate.stream_sort({
    streamId,
    delta: 1,
  })
}

const handleRenameStream = async (streamId: StreamId, defaultValue: string) => {
  const name = prompt('Stream Name', defaultValue)
  if (!name) {
    return
  }
  await store.mutate.stream_rename({
    streamId,
    name,
  })
}

const handleDeleteStream = async (streamId: StreamId, name: string) => {
  if (!confirm(`Are you sure you want to delete the "${name}" stream?`)) {
    return
  }
  await store.mutate.stream_delete({
    streamId,
  })
}

const handleDeleteAllData = async () => {
  if (!confirm('Are you sure you want to delete all data?')) {
    return
  }

  await store.mutate.danger_deleteAllData({
    userHasConfirmed: true,
  })
}
</script>

<main>
  <h1>Settings</h1>

  <h2>Streams</h2>

  <button onclick={handleCreateStream}>Create stream</button>

  <ul class="streamList">
    {#each streamList as stream (stream.id)}
      <li>
        <span class="name">{stream.name}</span>
        <button onclick={() => handleMoveStreamUp(stream.id)}>⬆️</button>
        <button onclick={() => handleMoveStreamDown(stream.id)}>⬇️</button>
        <button onclick={() => handleRenameStream(stream.id, stream.name)}>Rename</button>
        <button onclick={() => handleDeleteStream(stream.id, stream.name)}>Delete</button></li>
    {/each}
  </ul>

  <hr />

  <details class="dangerZone">
    <summary>⚠️ Danger Zone</summary>

    <h3>Delete all data</h3>
    <p>This will delete all data from the database. This cannot be undone.</p>
    <button onclick={handleDeleteAllData}>Delete all data</button>
  </details>
</main>

<style>
  main {
    max-width: var(--width-lg);
    margin-inline: auto;
  }

  .streamList {
    list-style: none;
    padding-inline-start: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-2);

    li {
      display: flex;
      align-items: center;
      gap: var(--size-2);
    }

    .name {
      flex: 1;
    }
  }

  .dangerZone {
    background: var(--color-red-300);
    color: var(--color-white);
    padding: var(--size-4);

    summary {
      font-weight: var(--weight-bold);
    }
  }
</style>
