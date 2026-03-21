import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    define: {
        'process.env.NODE_ENV': '"production"',
        appName: '"orgnotes"',
        appVersion: '"0.1.0"',
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
