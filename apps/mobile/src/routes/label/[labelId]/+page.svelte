<script lang="ts">
  import ColorPicker from 'svelte-awesome-color-picker'
  import type { PageData } from './$types'
  import { handleFormSubmit } from './actions.js'

  export let data: PageData

  let hex = data.label.color ?? undefined

  const handleSubmit = async (event: SubmitEvent) => {
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    await handleFormSubmit({ doc: data.doc, formData, labelId: data.labelId })
  }
</script>

<h2>Edit Label</h2>

<form on:submit|preventDefault={handleSubmit}>
  <input type="hidden" name="color" value={hex} />

  <input type="text" name="icon" value={data.label.icon} />

  <input type="text" name="name" value={data.label.name} />

  <ColorPicker bind:hex isAlpha={false} canChangeMode={false} />

  <input type="submit" value="Update" />
</form>
