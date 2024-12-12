<script lang="ts">
import type { Line } from '@stayradiated/pomo-core'
import type { Label } from '@stayradiated/pomo-doc'
import { getColorContrast } from '@stayradiated/pomo-core'
import * as dateFns from 'date-fns'

import { formatDuration } from './utils.js'

interface Props {
  line: Line
  labelRecord: Record<string, Label>
}

let { line, labelRecord }: Props = $props()

let height = $derived((line.durationMs / 1000 / 60) * 4)

let labelList = $derived(
  line.labelIdList
    .map((labelId) => {
      return labelRecord[labelId]
    })
    .filter(Boolean),
)

let labelNameList = $derived(
  labelList.map((label) => {
    return (label.icon ? label.icon + ' ' : '') + label.name
  }),
)

let color = $derived(labelList[0]?.color)
let colorBg = $derived(color ?? 'inherit')
let colorFg = $derived(
  color ? (getColorContrast(color) >= 0.5 ? 'black' : 'white') : 'inherit',
)
</script>

<div style="height: {height}px; background-color: {colorBg}; color: {colorFg};" class="container">
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
