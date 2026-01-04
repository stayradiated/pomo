import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

import { websocket } from '#lib/server/websocket/vite-middleware.js'

export default defineConfig({
  plugins: [sveltekit(), websocket()],
})
