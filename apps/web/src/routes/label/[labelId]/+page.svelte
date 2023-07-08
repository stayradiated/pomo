<script lang="ts">
  import ColorPicker from 'svelte-awesome-color-picker'
  import type { PageData } from './$types'

  export let data: PageData

  let hex = data.label.color ?? undefined
</script>

<h2>Edit Label</h2>

<form method="POST">
  <input type="hidden" name="color" value={hex} />

  <input type="text" name="icon" value={data.label.icon} />

  <input type="text" name="name" value={data.label.name} />

  <ColorPicker bind:hex isAlpha={false} canChangeMode={false} />

  <input type="submit" value="Update" />
</form>
