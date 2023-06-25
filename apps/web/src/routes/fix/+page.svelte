<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
  const { startedAtLocal, streamList, pointList } = data

  const getStream = (id: string) => {
    return streamList.find((stream) => stream.id === id)
  }
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
  <input type="datetime-local" name="startedAtLocal" value={startedAtLocal} />
  <button type="submit">Update</button>
</form>
