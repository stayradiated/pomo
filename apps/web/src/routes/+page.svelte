<script lang="ts">
import type { PageProps } from './$types'

import { query } from '#lib/utils/query.js'

const { data }: PageProps = $props()
const { store } = $derived(data)

const { userList } = $derived(
  query({
    userList: store.user.asList,
  }),
)

let counter = $state(1)

const handlePing = async () => {
  await store.mutate.ping({ message: `count ${counter}` })
  counter += 1
}
</script>

<h1>Users</h1>

{#each userList as user (user.id)}
  <div>ID: {user.id}</div>
  <pre><code>{JSON.stringify(user, null, 2)}</code></pre>
{/each}

<button onclick={handlePing}>Ping</button>
<p>Counter: {counter}</p>
