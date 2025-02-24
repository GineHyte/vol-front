import { sveltekit } from '@sveltejs/kit/vite';
import { optimizeImports } from 'carbon-preprocess-svelte';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit(), optimizeImports()],
	base: '.',
	build: {
		target: 'esnext',
		outDir: 'build',
		assetsDir: '.',
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`,
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			$lib: path.resolve(__dirname, './src/render/lib'),
		},
	},
});
