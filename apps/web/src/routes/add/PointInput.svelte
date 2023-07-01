<script lang="ts">
  import Select from 'svelte-select'
  import type { Stream, Point, Label } from '@stayradiated/pomo-core'

  export let streamIndex: number
  export let stream: Stream
  export let defaultPoint: Point | undefined
  export let labelRecord: Record<string, Label>

  let pointValue = defaultPoint?.value ?? ''

  const textareaId = `edit-stream-${streamIndex}`

  let filterText = ''

  type SelectLabelItem = {
    value: { type: 'connect'; id: string } | { type: 'create'; name: string }
    label: string
    created?: boolean
  }

  let value = defaultPoint?.labelIdList.map((id) => {
    const label = labelRecord[id]
    return {
      value: { type: 'connect', id: label.id },
      label: label.name,
    }
  })

  let items = Object.values(labelRecord).map(
    (label): SelectLabelItem => ({
      value: { type: 'connect', id: label.id },
      label: label.name,
    }),
  )

  const handleFilter = (event: CustomEvent<any>) => {
    console.log(event)

    if (value?.find((i) => i.label === filterText)) return
    if (event.detail.length === 0 && filterText.length > 0) {
      const prev = items.filter((i) => !i.created)
      items = [
        ...prev,
        {
          value: { type: 'create', name: filterText },
          label: filterText,
          created: true,
        },
      ]
    }
  }

  const handleChange = (_event: CustomEvent<any>) => {
    items = items.map((i) => {
      delete i.created
      return i
    })
  }
</script>

<input name="stream[{streamIndex}].id" value={stream.id} type="hidden" />

<div class="container">
  <label for={textareaId}>{stream.name}</label>

  <Select
    on:change={handleChange}
    multiple
    on:filter={handleFilter}
    bind:filterText
    bind:value
    {items}
    --border="1px solid transparent"
    --border-hover="1px solid var(--selection)"
    --list-background="var(--background)"
    --item-hover-bg="var(--selection)"
    --multi-item-bg="var(--background)"
    --multi-item-outline="var(--focus) 1px solid"
    --multi-item-clear-icon-color="var(--links)"
  >
    <div slot="item" let:item>
      {item.created ? 'Add new: ' : ''}
      {item.label}
    </div>
    <svelte:fragment slot="input-hidden" let:value>
      {#if Array.isArray(value)}
        {#each value as item, index}
          <input
            type="hidden"
            name="stream[{streamIndex}].label[{index}].type"
            value={item.value.type}
          />
          {#if item.value.type === 'create'}
            <input
              type="hidden"
              name="stream[{streamIndex}].label[{index}].name"
              value={item.value.name}
            />
          {:else}
            <input
              type="hidden"
              name="stream[{streamIndex}].label[{index}].id"
              value={item.value.id}
            />
          {/if}
        {/each}
      {/if}
    </svelte:fragment>
  </Select>

  <textarea
    rows="2"
    name="stream[{streamIndex}].value"
    id={textareaId}
    value={pointValue}
    placeholder="Description"
  />
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
  }

  label {
    font-weight: bold;
    line-height: 2rem;
  }
</style>
