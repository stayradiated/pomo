<script lang="ts">
  import type { Stream } from '@stayradiated/pomo-doc'
  import * as dateFns from 'date-fns'

  import { formatDuration } from './utils.js'

  export let stream: Stream
  export let durationMap: Map<string, number>
  export let streamStartedAt: number | undefined
  export let streamStoppedAt: number | undefined

  const totalDuration = Array.from(durationMap.values()).reduce(
    (a, b) => a + b,
    0,
  )
</script>

<div>
  <h3>{stream.name}</h3>
  <pre>{stream.id}</pre>

  <ul>
    {#each Array.from(durationMap.entries()) as [task, duration]}
      <li>{task}: {formatDuration(duration)}</li>
    {/each}
  </ul>

  <p>
    Started: {streamStartedAt
      ? dateFns.format(streamStartedAt, 'PPPPpp')
      : 'N/A'}
  </p>
  <p>
    Stopped: {streamStoppedAt
      ? dateFns.format(streamStoppedAt, 'PPPPpp')
      : 'N/A'}
  </p>
  <p>Total: {formatDuration(totalDuration)}</p>
</div>
