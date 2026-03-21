import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    build: {
        outDir: 'js',
        emptyOutDir: false,
        lib: {
            entry: 'src/app.js',
            name: 'orgnotesApp',
            formats: ['iife'],
            fileName: () => 'app.js',
        },
        rollupOptions: {},
    },
})
