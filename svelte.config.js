import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true,
		}),
		paths: {
			base: '',
			relative: true,
		},
		appDir: 'app',
		files: {
			routes: 'src/render/routes',
			lib: 'src/render/lib',
			appTemplate: 'src/app.html',
		},
		prerender: {
			entries: [],
			handleHttpError: 'warn',
		},
	},
};

export default config;
