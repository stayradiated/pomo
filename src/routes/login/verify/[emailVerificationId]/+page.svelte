<script lang="ts">
import { onMount } from 'svelte'

import type { PageProps } from './$types'

import { enhance } from '$app/forms'

const { data, form }: PageProps = $props()
const { email } = $derived(data)
const error = $derived(form?.error)

let timeZone = $state<string>()

onMount(() => {
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
})
</script>

<h1>Verify</h1>

<p>A verification email has been sent to {email}.</p>

<form use:enhance action="?/verify" method="post">
  <input type="hidden" name="timeZone" value={timeZone} />

  <input type="text" name="token" />

  <button type="submit">Verify</button>
</form>

{#if error}
  <p class="error">{error}</p>
{/if}

<style>
  .error {
    color: red;
  }
</style>
