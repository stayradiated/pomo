<script lang="ts">
import { onMount } from 'svelte'

import { enhance } from '$app/forms'

let timeZone = $state<string>()

onMount(() => {
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
})
</script>

<h1>Login</h1>

<form use:enhance action="?/login" method="post">
  <input type="hidden" name="timeZone" value={timeZone} />

  <label>
    Email
    <input type="email" name="email" />
  </label>

  <button type="submit">Login</button>
</form>
