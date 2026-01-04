<script lang="ts">
import type { PageProps } from './$types'

import { query } from '#lib/utils/query.js'

const { data }: PageProps = $props()
const { store } = $derived(data)

import { genId } from '#lib/utils/gen-id.js'

const { userList, streamList } = $derived(
  query({
    userList: store.user.asList,
    streamList: store.stream.asList,
  }),
)

let counter = $state(1)

const handlePing = async () => {
  await store.mutate.ping({ message: `count ${counter}` })
  counter += 1
}

const handleCreateStream = async () => {
  await store.mutate.stream_create({
    streamId: genId(),
    name: 'test',
  })
}
</script>

<h1>Pomo</h1>

<button onclick={handlePing}>Ping</button>
<p>Counter: {counter}</p>

<h2>Users</h2>
<p>Total: {userList.length}</p>
{#each userList as user (user.id)}
  <div>ID: {user.id}</div>
  <pre><code>{JSON.stringify(user, null, 2)}</code></pre>
{/each}

<h2>Streams</h2>
<p>Total: {streamList.length}</p>
{#each streamList as stream (stream.id)}
  <div>ID: {stream.id}</div>
  <pre><code>{JSON.stringify(stream, null, 2)}</code></pre>
{/each}

<button onclick={handleCreateStream}>Create Stream</button>
