import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Tahakom-Technology/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
