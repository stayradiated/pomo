import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),

    // add support for easily referencing the $routes folder
    alias: {
      '#lib': './src/lib',
      '#lib/*': './src/lib/*',
      '#routes': './src/routes',
      '#routes/*': './src/routes/*',
    },
  },
}

export default config
