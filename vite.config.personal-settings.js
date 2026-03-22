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
            entry: 'src/personal-settings.js',
            name: 'orgnotesPersonalSettings',
            formats: ['iife'],
            fileName: () => 'js/personal-settings.js',
        },
        rollupOptions: {
            output: {
                assetFileNames: 'css/personal-settings[extname]',
            },
        },
    },
})
