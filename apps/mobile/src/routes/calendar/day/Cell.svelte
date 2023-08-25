<script lang="ts">
  import type { Line } from '@stayradiated/pomo-core'
  import type { Label } from '@stayradiated/pomo-doc'
  import { getColorContrast } from '@stayradiated/pomo-core'
  import * as dateFns from 'date-fns'

  import { formatDuration } from './utils.js'

  export let line: Line
  export let labelRecord: Record<string, Label>

  $: height = line.durationMs / 1000 / 60 * 4

  $: labelList = line.labelIdList
    .map((labelId) => {
      return labelRecord[labelId]
    })
    .filter(Boolean)

  $: labelNameList = labelList.map((label) => {
    return (label.icon ? label.icon + ' ' : '') + label.name
  })

  $: color = labelList[0]?.color
  $: colorBg = color ?? 'inherit'
  $: colorFg = color
    ? getColorContrast(color) >= 0.5
      ? 'black'
      : 'white'
    : 'inherit'
</script>

<div
  style="height: {height}px; background-color: {colorBg}; color: {colorFg};"
  class="container"
>
  <span>{labelNameList.join(', ')}</span>
  <span>{dateFns.format(line.startedAt, 'HH:mm')}</span>
  <span>+{formatDuration(line.durationMs)}</span>
</div>

<style>
  .container {
    box-sizing: border-box;

    overflow: hidden;
    opacity: 0.8;
    border-radius: 4px;
    padding: 0 8px;

    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  }
</style>
