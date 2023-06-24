<script lang="ts">
  import type { PageData } from "./types";

  import StreamDuration from './StreamDuration.svelte';
  import Column from './Column.svelte';

  export let data: PageData;
  const { streamList, lineList, streamDurationMap, streamStartedAtMap, streamStoppedAtMap } = data;
</script>

<h2>This Week</h2>

<Column lineList={lineList} />

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


