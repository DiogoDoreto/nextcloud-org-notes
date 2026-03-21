import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    build: {
        outDir: 'js',
        lib: {
            entry: 'src/main.js',
            name: 'orgnotes',
            formats: ['iife'],
            fileName: () => 'main.js',
        },
        rollupOptions: {},
    },
})
