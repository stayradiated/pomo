<script lang="ts">
  import Select from 'svelte-select'
  import type { Stream, Point, Label } from '@stayradiated/pomo-doc'
  import { offset, shift } from '@floating-ui/dom';

  export let streamIndex: number
  export let stream: Stream
  export let defaultPoint: Point | undefined
  export let labelRecord: Record<string, Label>
  export let onReset: () => void

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
      label: (label.icon ? label.icon + ' ' : '') + label.name,
    }
  })

  let items = Object.values(labelRecord).map(
    (label): SelectLabelItem => ({
      value: { type: 'connect', id: label.id },
      label: (label.icon ? label.icon + ' ' : '') + label.name,
    }),
  )

  const handleFilter = (event: CustomEvent<any>) => {
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

<div class="container">
  <div class="row">
    <label for={textareaId}>{stream.name}</label>
    <button class="reset-button" on:click|preventDefault={onReset}>
      Reset
    </button>
  </div>

  <Select
    focused
    listOpen
    multiple
    floatingConfig={{middleware: [ offset(5), shift(), /* flip() */ ]}}

    on:change={handleChange}
    on:filter={handleFilter}
    bind:filterText
    bind:value
    {items}

    --background="var(--theme-background-alt)"
    --border-radius="var(--radius-xs)"
    --border="1px solid transparent"
    --border-hover="1px solid var(--theme-selection)"
    --list-background="var(--theme-background)"
    --list-color="var(--theme-text-bright)"
    --item-color="var(--theme-text-main)"
    --item-hover-color="var(--theme-text-bright)"
    --item-hover-bg="var(--theme-selection)"
    --multi-item-bg="var(--theme-background)"
    --multi-item-outline="var(--theme-focus) 1px solid"
    --multi-item-clear-icon-color="var(--theme-links)"
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

  <div class="textarea-container">
    <textarea
      rows="1"
      name="stream[{streamIndex}].value"
      id={textareaId}
      bind:value={pointValue}
      placeholder="Add description…"
    />
    {#if pointValue.length > 0}
      <button class="clear-value-button" on:click|preventDefault={() => pointValue = ''}>X</button>
    {/if}
  </div>
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
  }

  .row {
    display: flex;
    justify-content: space-between;
  }

  label {
    font-weight: bold;
    line-height: 2rem;
    color: var(--theme-text-main);
  }

  .textarea-container {
    display: flex;
    gap: var(--size-2);
    padding-top: var(--size-2);
  }

  textarea {
    flex: 1;
    background: var(--theme-background);
    color: var(--theme-text-main);
    border: none;
    border-radius: var(--radius-xs);
    line-height: var(--line-xl);
    resize: none;
    padding: var(--size-1) var(--size-3);
  }
  textarea:focus {
    outline: var(--size-px) solid var(--theme-focus);
  }

  .clear-value-button {
    border: none;
    background: none;
    cursor: pointer;
    width: var(--size-10);
    font-weight: var(--weight-bold);
    background: var(--theme-background);
    border-radius: var(--radius-xs);
  }
  .clear-value-button:hover {
    background: var(--theme-background-alt);
  }

  .reset-button {
    border: none;
    background: none;
    text-transform: uppercase;
    font-size: var(--scale-000);
    cursor: pointer;
    color: var(--theme-text-muted);
    font-weight: var(--weight-bold);
  }
  .reset-button:hover {
    color: var(--theme-text-main);
  }

</style>
