<script lang="ts">
  import type { PageData } from "./types";
  import StreamDuration from './StreamDuration.svelte';

  export let data: PageData;
  const { streamList, streamDurationMap, streamStartedAtMap, streamStoppedAtMap } = data;
</script>

<h2>This Week</h2>

{#each streamList as stream}
  {#if streamDurationMap.has(stream.id)}
    <StreamDuration
      stream={stream}
      durationMap={streamDurationMap.get(stream.id) ?? new Map()}
      streamStartedAt={streamStartedAtMap.get(stream.id)}
      streamStoppedAt={streamStoppedAtMap.get(stream.id)}
    />
  {/if}
{/each}


