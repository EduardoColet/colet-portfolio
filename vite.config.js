import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// Duas páginas: a home e a página de cada projeto (/projeto/?p=<slug>).
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        projeto: resolve(import.meta.dirname, 'projeto/index.html'),
      },
    },
  },
})
