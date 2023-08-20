<script lang="ts">
  import type { Doc, Stream, Label } from '@stayradiated/pomo-doc'
  import { handleDeleteFormSubmit } from './actions.js';

  export let stream: Stream
  export let labelListMap: Map<string|null, Label[]>
  export let labelRecord: Record<string, Label>
  export let doc: Doc

  $: labelIdList = Array.from(labelListMap.values()).flatMap((list) => list.map((label) => label.id))

  let selected: string[] = []
  $: selectedAll = selected.length === labelIdList.length

  const handleToggleAll = (event: Event) => {
    const target = event.target as HTMLInputElement
    const checked = target.checked

    if (checked) {
      selected = labelIdList
    } else {
      selected = []
    }
  }

  $: toggleHtmlId = `stream-${stream.id}-all`

  const handleSubmit = async (event: SubmitEvent) => {
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    handleDeleteFormSubmit({ doc, formData })
  }
</script>

<h3>{stream.name}</h3>

<form on:submit|preventDefault={handleSubmit}>
  <input type="hidden" name="stream" value={stream.id} />
  <input type="submit" name="action:delete" value="Delete" />

  <ul>
    <li>
      <input
        type="checkbox"
        id={toggleHtmlId}
        on:change={handleToggleAll}
        checked={selectedAll}
        autocomplete="off"
      />
      <label for={toggleHtmlId}><strong>Select All</strong></label>
    </li>
    {#each Array.from(labelListMap.entries()) as [parentId, labelList]}
      {#if typeof parentId === 'string'}
        {@const parent = labelRecord[parentId]}
        <h3>{parent.name}</h3>
      {/if}

      {#each labelList as label}
        {@const htmlId = `stream-${stream.id}-label-${label.id}`}
        <li>
          <input
            type="checkbox"
            id={htmlId}
            name="label"
            value={label.id}
            bind:group={selected}
            autocomplete="off"
          />
          <label for={htmlId}>
            <div style="background-color: {label.color};" class="color-swatch" />
            <a href="./label/{label.id}">{label.icon ? label.icon + ' ' : ''}{label.name}</a>
          </label>
        </li>
      {/each}
    {/each}
  </ul>
</form>

<style>
  .color-swatch {
    display: inline-block;
    width: 1em;
    height: 1em;
    border-radius: 0.5em;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    vertical-align: middle;
  }
</style>
