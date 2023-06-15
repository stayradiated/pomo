<script lang="ts">
  import type { PageData } from './$types'
  import { format, parse } from 'date-fns'

  export let data: PageData
  const { startedAt, streamList, pointList } = data

  const getStream = (id: string) => {
    return streamList.find((stream) => stream.id === id)
  }

  let inputString = format(startedAt, "yyyy-MM-dd'T'HH:mm")

  $: inputDate = parse(inputString, "yyyy-MM-dd'T'HH:mm", startedAt)

</script>

<ul>
  {#each pointList as point}
    <li>
      <strong>{getStream(point.streamId)?.name}</strong>
      <code>{point.value}</code>
    </li>
  {/each}
</ul>


<form method="POST">
  {#each pointList as point}
    <input type="hidden" name="pointId" value={point.id} />
  {/each}

  <input type="datetime-local" name="datetimeLocal" bind:value={inputString} />
  <button type="submit">Update</button>
</form>

<ul>
  <li>Original: <time datetime={startedAt.toISOString()}>{format(startedAt, 'PPpp')}</time></li>
  <li>Updated: <time datetime={startedAt.toISOString()}>{format(inputDate, 'PPpp')}</time></li>
</ul>

<code>Timezone: { format(startedAt, 'z') }</code>
