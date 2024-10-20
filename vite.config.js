import path from 'path'
import process from 'process'
import { defineConfig } from 'vite'
module.exports = defineConfig(async ({ command, mode }) => {
    const { svelte } = await import('@sveltejs/vite-plugin-svelte');
    return {
      server: {
        port: 8000,
      },
      plugins: [svelte()],
      resolve: {
        alias: {
          '@': path.resolve('src/renderer/src'),
        },
      },
      root: path.resolve(process.cwd(), 'src/renderer'),
      base: './',
    
  }
});