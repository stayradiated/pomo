import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import adapterNode from '@sveltejs/adapter-node'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapterNode(),
  },
}

export default config
