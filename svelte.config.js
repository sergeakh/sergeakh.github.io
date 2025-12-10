import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { classNameReplacer } from 'p1-front-box/plugins/svelteClassNameReplacer.js';

export default {
	// Consult https://svelte.dev/docs#compile-time-svelte-preprocess
	// for more information about preprocessors
	preprocess: [vitePreprocess(), classNameReplacer]
};
