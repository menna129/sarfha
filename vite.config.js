


import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/sarfha/' : '/',
  plugins: [react()],
  server: {
    allowedHosts: ['alex-verde-moment-tops.trycloudflare.com'],
  },
  build: {
    outDir: 'docs',
  },
})
