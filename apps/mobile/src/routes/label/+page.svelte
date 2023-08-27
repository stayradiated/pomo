<script lang="ts">
  import { page } from '$app/stores'
  import type { PageData } from './$types'
  import StreamLabelList from './StreamLabelList.svelte'

  export let data: PageData

  $:({ streamList, stream, labelRecord, streamLabelMap, doc } = data)
</script>

<h2>Labels</h2>

<nav>
  {#each streamList as stream}
    <a
      href={`?stream=${stream.id}`}
      class:active={$page.url.searchParams.get('stream') === stream.id}
    >{stream.name}</a>
  {/each}
</nav>

<StreamLabelList {stream} labelListMap={streamLabelMap} {labelRecord} {doc} />

<style>
  nav {
    display: flex;
    gap: var(--size-2);
  }

  nav a {
    display: block;
    padding: var(--size-2) var(--size-3);
    border-radius: var(--radius-xs);
    background-color: var(--theme-background);
    color: var(--theme-text-main);
    text-decoration: none;
  }

  nav a:hover {
    background-color: var(--theme-background-alt);
  }

  nav a.active {
    background-color: var(--theme-button-base);
    color: var(--theme-text-bright);
  }

  nav a.active:hover {
    background-color: var(--theme-button-hover);
  }

  h2 {
    margin: 0;
  }

  main {
    max-width: var(--width-md);
    margin: 0 auto;
  }

</style>
