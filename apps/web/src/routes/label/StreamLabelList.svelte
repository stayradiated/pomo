<script lang="ts">
  import type { Stream, Label } from '@stayradiated/pomo-doc'

  export let stream: Stream
  export let labelList: Label[]

  let selected: string[] = []
  $: selectedAll = selected.length === labelList.length

  const handleToggleAll = (event: Event) => {
    const target = event.target as HTMLInputElement
    const checked = target.checked

    if (checked) {
      selected = labelList.map((label) => label.id)
    } else {
      selected = []
    }
  }

  const toggleHtmlId = `stream-${stream.id}-all`
</script>

<h3>{stream.name}</h3>

<form method="POST">
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
          <a href="./label/{label.id}">{label.name}</a>
        </label>
      </li>
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
