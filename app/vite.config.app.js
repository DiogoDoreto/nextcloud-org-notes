import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    define: {
        'process.env.NODE_ENV': '"production"',
    },
    build: {
        outDir: '.',
        emptyOutDir: false,
        lib: {
            entry: 'src/app.js',
            name: 'orgnotesApp',
            formats: ['iife'],
            fileName: () => 'js/app.js',
        },
        cssFileName: 'app',
        rollupOptions: {
            output: {
                assetFileNames: 'css/[name][extname]',
            },
        },
    },
})
