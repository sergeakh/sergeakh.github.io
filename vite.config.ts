import { svelteTesting } from '@testing-library/svelte/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import IconSpritePlugin from '../../packages/p1-front-box/plugins/vite-plugin-icon-sprite.js';
import buildMetadata from 'vite-plugin-build-metadata';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
	server: {
		https: {
			key: readFileSync('./.cert/key.pem'),
			cert: readFileSync('./.cert/cert.pem')
		},
		host: '0.0.0.0',
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	},
	build: {
		target: 'es2020',
		rollupOptions: {
			output: {
				entryFileNames: 'a/a[hash].js',
				chunkFileNames: 'a/a[hash].js',
				assetFileNames: 'a/a[hash][extname]'
			}
		}
	},
	esbuild: {
		...(mode === 'production' ? { drop: ['console', 'debugger'] } : {})
	},
	plugins: [
		...(mode === 'production'
			? [
					svelte({
						compilerOptions: {
							cssHash: (opts) => {
								return `p-${opts.hash(opts.css)}`;
							}
						}
					})
				]
			: [svelte()]),
		IconSpritePlugin(resolve(__dirname, '../../packages/p1-front-box/src/icons')),
		VitePWA({
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'service-worker.js',
			manifest: {
				name: 'NoteTags',
				short_name: 'NoteTags',
				description: 'A simple app manager notes and bookmarks with tags',
				icons: [
					{ src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
					{ src: '/icon-mask.png', type: 'image/png', sizes: '512x512', purpose: 'maskable' },
					{ src: '/icon-512.png', type: 'image/png', sizes: '512x512' }
				],
				display: 'standalone',
				start_url: '/',
				background_color: '#fff',
				theme_color: '#fff',
				shortcuts: [
					{
						name: 'add a note',
						short_name: 'add a note',
						description: 'page to add a note',
						url: '/?dialogPages=newNote',
						icons: [
							{
								src: 'add.svg',
								sizes: '192x192'
							}
						]
					}
				],
				related_applications: [
					{
						platform: 'webapp',
						url: 'https://sergeakh.github.io/manifest.webmanifest'
					}
				]
			}
		}),
		buildMetadata({
			fileName: 'build-metadata.json'
		})
	],

	define: {
		'import.meta.env.APP_VERSION': JSON.stringify(
			JSON.parse(readFileSync('./package.json').toString()).version
		),
		'import.meta.env.APP_BUILD_DATE': JSON.stringify(JSON.parse('' + Date.now())),
		'import.meta.env.PLATFORM': JSON.stringify('web')
	},

	test: {
		workspace: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],

				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.{test,spec}.{js,ts}'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			}
		]
	}
}));
