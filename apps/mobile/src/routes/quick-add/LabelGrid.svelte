<script lang="ts">
import type { Label } from '@stayradiated/pomo-doc'
import { getUiColor } from '@stayradiated/pomo-core'

interface Props {
  labelRecord: Record<string, Label>
  labelIdList: string[]
}

let { labelRecord, labelIdList }: Props = $props()
</script>

<ul class="grid">
	{#each labelIdList as labelId (labelId)}
		{@const label = labelRecord[labelId]}
		{@const { colorFg, colorBg, colorOp } = getUiColor(label.color ?? '#eee')}
		<li class="label" style="--colorFg: {colorFg}; --colorBg: {colorBg}; --colorOp: {colorOp}">
			{#if label.icon}
				<span class="label-icon">{label.icon}</span>
			{/if}
			<span class="label-name">{labelRecord[labelId].name}</span>
			<span class="label-parent-list">
				{#if label.parentId}
					{@const parentLabel = labelRecord[label.parentId]}
					<span class="label-parent">
						{parentLabel.icon ?? ''}
						{parentLabel.name}
					</span>
					{#if parentLabel.parentId}
						{@const grandParentLabel = labelRecord[parentLabel.parentId]}
						<span class="label-parent">
							{grandParentLabel.icon ?? ''}
							{grandParentLabel.name}
						</span>
					{/if}
				{/if}
			</span>
		</li>
	{/each}
</ul>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;

		padding: 1rem;
		margin: 0;
	}

	.label {
		list-style: none;
		padding: 0.5rem;
		border-radius: 4px;

		display: flex;
		flex-direction: column;
		align-items: center;

		background-color: rgb(var(--colorBg));
		color: rgb(var(--colorFg));
		box-shadow: var(--shadow-sm);
	}

	.label-icon {
		font-size: 3rem;
		border-radius: 50%;
		padding: 0.5rem;
		width: 3.5rem;
		height: 3.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.label-name {
		font-size: 1.2rem;
		font-weight: bold;
		text-align: center;
	}

	.label-parent {
		background-color: rgba(var(--colorOp), 0.2);
		color: rgb(var(--colorFg));
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		white-space: nowrap;
	}
</style>
