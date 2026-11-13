import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/sarfha/',
  plugins: [react()],
  bulid: {
    outDir: 'doce' , 
  } ,
} )