<script lang="ts">
  import type { Stream, Point, Slice } from '@stayradiated/pomo-core';
  import { format } from 'date-fns'
  import { stripComments } from '@stayradiated/pomo-core';

  export let streamList: Stream[]
  export let pointList: Point[]
  export let sliceList: Slice[]

  console.log({ sliceList })

  const pointsByStreamId = pointList.reduce<Map<string, PartialPoint[]>>(
    (acc, point) => {
      const { streamId } = point
      const list: PartialPoint[] = acc.get(streamId) ?? []
      list.push(point)
      acc.set(streamId, list)
      return acc
    },
    new Map(),
  )

</script>

<div>
  <div>
    <p color="magentaBright">id</p>
  </div>
  <div>
    <p color="magentaBright">time</p>
  </div>
  {#each streamList as stream}
    <div>
      <p color="magentaBright">{stream.name}</p>
    </div>
  {/each}
</div>

{#each sliceList as slice}
  <div>
    <div>
      <p color="white">{slice.lineList[0]?.id.slice(0, 7)}</p>
    </div>

    <div>
      <p color="green">{format(slice.startedAt, 'HH:mm')}</p>
    </div>

    {#each streamList as stream}
      {@const point = pointsByStreamId.get(stream.id)?.find((point) => point.sliceId === slice.id)}
      {#if point}
        <div>
          <p color="white">{stripComments(point.value)}</p>
        </div>
      {:else}
        <div />
      {/if}
    {/each}
  </div>
{/each}
