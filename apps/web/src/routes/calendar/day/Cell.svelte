<script lang="ts">
  import type { Line, Label } from '@stayradiated/pomo-core'
  import * as dateFns from 'date-fns'

  import { formatDuration, getColorContrast } from './utils.js'

  export let line: Line
  export let labelRecord: Record<string, Label>

  const height = line.durationMs / 1000 / 60

  const labelNameList = line.labelIdList.map((labelId) => {
    const label = labelRecord[labelId]
    return label.name
  })

  const colorRecord: Record<string, string> = {
    '47ed6e03-6c47-4a8a-b817-57744df7b9b7': '#4057df', // Runn
    '0ed54032-8b5c-405e-b658-a5c4e60460a6': '#ccc', // Sleep
  }

  const color = colorRecord[line.labelIdList[0]]
  const colorBg = colorRecord[line.labelIdList[0]] ?? 'inherit'
  const colorFg = color
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
    padding: 8px;

    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  }
</style>
