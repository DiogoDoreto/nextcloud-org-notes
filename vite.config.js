import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [vue()],
	define: {
		'process.env.NODE_ENV': '"production"',
	},
	build: {
		outDir: '.',
		emptyOutDir: false,
		lib: {
			entry: 'src/main.js',
			name: 'orgnotes',
			formats: ['iife'],
			fileName: () => 'js/main.js',
		},
		cssFileName: 'main',
		rollupOptions: {
			output: {
				assetFileNames: 'css/[name][extname]',
			},
		},
	},
})
